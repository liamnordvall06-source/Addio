const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const admin = require("firebase-admin");

const Stripe = require("stripe")

const stripe = new Stripe("sk_test_51SuzWbRyRkrtaFuNZWpETGjbkQAoufaBmRPUpVQPyz2I5clxGwOetqJHvXhX9aqYrdPTGPf5FjyvxmqBMpMdxHcF00vALvcVV5");


setGlobalOptions({ maxInstances: 10 });

admin.initializeApp();
const db = admin.firestore();

const app = express();


app.use(express.json({ limit: "10mb" }));

app.get("/materials", async (req, res) => {
  try {
    const snapshot = await db.collection("materials").get();
    const materials = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json({ materials });
  } catch (e) {
    logger.error("api_error", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/getQoute", async (req, res) => {
  try {
    const { quantity, materialId, infill, color, fileId } = req.body || {};

    if (!fileId) return res.status(400).json({ error: "fileId is required" });
    if (!materialId) return res.status(400).json({ error: "materialId is required" });

    const qty = Number(quantity);
    const inf = Number(infill);

    if (!Number.isFinite(qty) || qty <= 0) {
      return res.status(400).json({ error: "quantity must be a positive number" });
    }
    if (!Number.isFinite(inf) || inf < 0 || inf > 100) {
      return res.status(400).json({ error: "infill must be 0..100" });
    }

    const materialSnap = await db.collection("materials").doc(materialId).get();
    if (!materialSnap.exists) return res.status(404).json({ error: "material not found" });

    const material = materialSnap.data();

    const pricePerGram = Number(material.cost);
    const densityGPerCm3 = Number(material.density);
    if (!Number.isFinite(pricePerGram) || !Number.isFinite(densityGPerCm3)) {
      return res.status(500).json({ error: "Material missing cost/density" });
    }

    // --- Download STL ---
    const bucket = admin.storage().bucket();
    const fileRef = bucket.file(fileId);

    const [exists] = await fileRef.exists();
    if (!exists) {
      return res.status(404).json({ error: "STL not found in storage for fileId" });
    }

    const [stlBuffer] = await fileRef.download();

    // --- Parse STL ---
    let triangles;
    if (looksLikeBinarySTL(stlBuffer)) {
      triangles = parseBinarySTL(stlBuffer);
    } else {
      triangles = parseAsciiSTL(stlBuffer.toString("utf8"));
    }

    if (!triangles || triangles.length === 0) {
      return res.status(400).json({ error: "Could not parse STL (no triangles found)" });
    }

    // --- Geometry ---
    const volumeUnits3 = computeVolumeFromTriangles(triangles);

    const assumeMillimeters = true;
    const volumeCm3 = assumeMillimeters ? volumeUnits3 / 1000 : volumeUnits3;

    const infillRatio = Math.max(0.15, inf / 100);
    const usedVolumeCm3 = volumeCm3 * infillRatio;

    const weightG = usedVolumeCm3 * densityGPerCm3;
    const materialCost = weightG * pricePerGram;

    // --- Pricing (YOUR VALUES, unchanged) ---
    const setupFee = 720;
    const handlingFeePerUnit = 25;
    const overheadPct = 2.5;

    const unitSubtotal = materialCost + handlingFeePerUnit;
    const unitPrice = unitSubtotal * (1 + overheadPct);
    const total = setupFee + unitPrice * qty;

    // Convert SEK to öre for Stripe
    const totalOre = Math.round(total * 100);

    // Save quote to Firestore (collection: "qoutes")
    const quoteRef = await db.collection("qoutes").add({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "pending_payment",

      // keep your inputs so you can reproduce pricing later
      input: { quantity: qty, materialId, infill: inf, color, fileId },

      // store what you calculated
      geometry: {
        triangles: triangles.length,
        volumeUnits3: round2(volumeUnits3),
        volumeCm3: round2(volumeCm3),
        infillRatio,
        usedVolumeCm3: round2(usedVolumeCm3),
        weightG: round2(weightG),
      },
      pricing: {
        pricePerGram,
        densityGPerCm3,
        materialCost: round2(materialCost),
        setupFee,
        handlingFeePerUnit,
        overheadPct,
        unitPrice: round2(unitPrice),
        totalSek: round2(total),
        totalOre,              // <-- important for Stripe
        currency: "sek",
      }
    });

    return res.status(200).json({
      success: true,
      quoteId: quoteRef.id,
      input: { quantity: qty, materialId, infill: inf, color, fileId },
      geometry: {
        triangles: triangles.length,
        volumeUnits3: round2(volumeUnits3),
        volumeCm3: round2(volumeCm3),
        infillRatio,
        usedVolumeCm3: round2(usedVolumeCm3),
        weightG: round2(weightG),
      },
      pricing: {
        pricePerGram,
        densityGPerCm3,
        materialCost: round2(materialCost),
        setupFee,
        handlingFeePerUnit,
        overheadPct,
        unitPrice: round2(unitPrice),
        total: round2(total),
      },
    });
  } catch (e) {
    logger.error("api_error", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/createPaymentLink", async (req, res) => {
  try {
    const { quoteId } = req.body || {};
    if (!quoteId) return res.status(400).json({ error: "quoteId is required" });

    const quoteSnap = await db.collection("qoutes").doc(quoteId).get();
    if (!quoteSnap.exists) return res.status(404).json({ error: "quote not found" });

    const quote = quoteSnap.data();
    const totalOre = Number(quote?.pricing?.totalOre);

    if (!Number.isFinite(totalOre) || totalOre <= 0) {
      return res.status(500).json({ error: "quote missing valid pricing.totalOre" });
    }

    // ✅ must be absolute URLs
    const successUrl = `https://brandit3d.com/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `https://brandit3d.com/cancel?quote_id=${encodeURIComponent(quoteId)}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "sv",
      customer_creation: "always",

      client_reference_id: quoteId,
      metadata: { quote_id: quoteId },

      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "sek",
            unit_amount: totalOre,
            product_data: { name: `Quote ${quoteId}` },
          },
        },
      ],

      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    await quoteSnap.ref.update({
      stripeSessionId: session.id,
      stripeCheckoutUrl: session.url || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({ url: session.url });
  } catch (e) {
    // 🔥 Log the real Stripe error so you can see what's wrong
    logger.error("stripe_create_checkout_session_failed", {
      message: e?.message,
      type: e?.type,
      code: e?.code,
      param: e?.param,
      raw: e?.raw,
      stack: e?.stack,
    });

    // Send a useful error to client (still safe)
    return res.status(500).json({
      error: e?.message || "Internal server error",
    });
  }
});




function computeVolumeFromTriangles(tris) {
  let sum = 0;
  for (const t of tris) {
    const [p1, p2, p3] = t;
    const cx = p2[1] * p3[2] - p2[2] * p3[1];
    const cy = p2[2] * p3[0] - p2[0] * p3[2];
    const cz = p2[0] * p3[1] - p2[1] * p3[0];
    sum += p1[0] * cx + p1[1] * cy + p1[2] * cz;
  }
  return Math.abs(sum) / 6;
}


function parseBinarySTL(buffer) {
  // Guard: must be at least header + triCount
  if (buffer.length < 84) return [];

  const triCount = buffer.readUInt32LE(80);
  const expected = 84 + triCount * 50;

  // Guard: if triangle count is bogus, don't crash
  if (expected > buffer.length) return [];

  const tris = [];
  let offset = 84;

  for (let i = 0; i < triCount; i++) {
    // normal (12 bytes)
    offset += 12;

    const v1 = [buffer.readFloatLE(offset), buffer.readFloatLE(offset + 4), buffer.readFloatLE(offset + 8)];
    offset += 12;

    const v2 = [buffer.readFloatLE(offset), buffer.readFloatLE(offset + 4), buffer.readFloatLE(offset + 8)];
    offset += 12;

    const v3 = [buffer.readFloatLE(offset), buffer.readFloatLE(offset + 4), buffer.readFloatLE(offset + 8)];
    offset += 12;

    tris.push([v1, v2, v3]);

    // attr count (2 bytes)
    offset += 2;
  }

  return tris;
}


function parseAsciiSTL(text) {
  const tris = [];
  const lines = text.split(/\r?\n/);
  const verts = [];

  for (const line of lines) {
    const m = line.trim().match(/^vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)$/);
    if (m) {
      verts.push([parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])]);
      if (verts.length === 3) {
        tris.push([verts[0], verts[1], verts[2]]);
        verts.length = 0;
      }
    }
  }
  return tris;
}


function looksLikeBinarySTL(buffer) {
  if (buffer.length < 84) return false;

  const triCount = buffer.readUInt32LE(80);
  const expected = 84 + triCount * 50;

  // If expected matches length, almost certainly binary
  if (expected === buffer.length) return true;

  // If it looks like ASCII at the start, treat as ASCII
  const start = buffer.slice(0, 200).toString("utf8");
  if (start.startsWith("solid") && start.includes("facet")) return false;

  // Otherwise, likely binary
  return true;
}


function round2(n) {
  return Math.round(n * 100) / 100;
}



exports.api = onRequest(
  {
    cors: true,
  },
  app
);
