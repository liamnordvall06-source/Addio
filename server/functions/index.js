const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { defineSecret } = require("firebase-functions/params");
const { fetch, FormData } = require("undici");
const { openAsBlob } = require("fs"); 
const fs = require("fs");
const path = require("path");
// eyJ1c2VyX2lkIjoiZmMzN2YxMzUtMzRlOC00YzA4LThiY2YtNDQ3YWJmY2MyYzMyIiwiZW1haWwiOiJsaWFtbm9yZHZhbGwwNkBnbWFpbC5jb20iLCJ0b2tlbl9pZCI6IjFiN2ZlZTU2LTZhYTEtNDAxMC04NDMwLWYzNjhiOGRjNTQwNSIsIm5hbWUiOiJRb3V0YXRpb25Ub2tlbiJ9
const express = require("express");
const admin = require("firebase-admin");
const Stripe = require("stripe");

admin.initializeApp();

const db = admin.firestore();


setGlobalOptions({ maxInstances: 20 });


const app = express();
app.use(express.json({ limit: "10mb" }));

const CLOUDSLICER_TOKEN = defineSecret("CLOUDSLICER_TOKEN");
const STRIPE_TOKEN = defineSecret("STRIPE_TOKEN");


app.post("/file", async (req, res) => {
  let tmpPath = null;

  try {
    const storagePath = req.header("X-Storage-Path");
    const fileName = req.header("X-File-Name");

    if (!storagePath || !fileName) {
      return res.status(400).json({
        error: "Missing X-Storage-Path or X-File-Name header",
      });
    }

    tmpPath = path.join("/tmp", fileName);

    await admin.storage().bucket().file(storagePath).download({
      destination: tmpPath,
    });

    const form = new FormData();
    form.append("file", await openAsBlob(tmpPath), fileName);

    const response = await fetch("https://api.cloudslicer3d.com/v1/file", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLOUDSLICER_TOKEN.value()}`,
        Accept: "application/json",
      },
      body: form,
    });

    const text = await response.text();
    return res.status(response.status).send(text);
  } catch (e) {
    logger.error(e);
    return res.status(500).json({ error: e.message });
  } finally {

    if (tmpPath) {
      fs.promises.unlink(tmpPath).catch(() => {});
    }
  }
});


app.get("/material", async (req, res) => {
  try {

    const response = await fetch("https://api.cloudslicer3d.com/v1/filament", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CLOUDSLICER_TOKEN.value()}`,
      }
    })

    const data = await response.json();

    return res.status(response.status).json(data);


  } catch (e) {
    logger.error(e);
    return res.status(500).json({ error: e.message });
  }
})


app.post("/qoute", async (req, res) => {
  try {

    const jsonObj = req.body;

    const obj = {
      "printer_id": "22d3c057b9af43f297b963f979aca0a5",
      "filament_id": jsonObj.materialId,
      "slicer_model": "bambu_studio",
      "pricing_config": {
        "currency": "USD",
        "cost_per_hour": 0.4,
        "cost_per_gram": 0.02,
        "base_price": 0,
        "printer_watts": 100,
        "cost_per_kwh": 0.12
      },
      "print_settings": {
        "name": "Default Print Settings",
        "layers_and_perimeters": {
          "layer_height": {
            "layer_height": 0.2,
            "first_layer_height": 0.2,
            "top_layers": 5,
            "bottom_layers": 3,
            "perimeters": 3
          },
          "advanced": {
            "detect_thin_walls": false,
            "thick_bridges": true,
            "seam_position": "nearest",
            "perimeter_generator": "classic",
            "elefant_foot_compensation": 0.15,
            "xy_size_compensation": 0,
            "xy_hole_compensation": 0
          }
        },
        "extrusion_width": {
          "default": 0.45,
          "first_layer": 0.42,
          "external_perimeter": 0.4,
          "perimeter": 0.45,
          "infill": 0.45,
          "solid_infill": 0.45,
          "top_infill": 0.4,
          "support": 0.42
        },
        "infill": {
          "fill_density": `${jsonObj.infill}%`,
          "fill_pattern": "grid",
          "fill_angle": 45,
          "infill_anchor": 2.5,
          "infill_anchor_max": 15,
          "infill_overlap": "25%",
          "top_fill_pattern": "monotoniclines",
          "ironing_type": "top",
          "solid_infill_every_layers": 0,
          "combine_infill_every_layers": 0
        },
        "skirt_and_brim": {
          "skirt": {
            "loops": 0,
            "distance": 2,
            "height": 2
          },
          "brim": {
            "type": "no_brim",
            "width": 5,
            "separation_gap": 0.1
          }
        },
        "support_material": {
          "enable": false,
          "style": "grid",
          "pattern": "rectilinear",
          "threshold_angle": 40,
          "buildplate_only": false,
          "top_z_distance": 0.15,
          "xy_distance": 0.5,
          "spacing": 2,
          "top_interface_layers": 2,
          "bottom_interface_layers": 0,
          "interface_pattern": "rectilinear",
          "interface_spacing": 0,
          "dont_support_bridges": false,
          "raft_layers": 0,
          "raft_first_layer_expansion": 2
        },
        "speed": {
          "perimeters": 300,
          "small_perimeters": "50%",
          "external_perimeters": 200,
          "infill": 270,
          "solid_infill": 250,
          "top_solid_infill": 200,
          "support_material": 150,
          "support_material_interface": 80,
          "gap_fill": 250,
          "ironing": 15,
          "travel": 500,
          "travel_z": 0,
          "first_layer": 50,
          "first_layer_infill": 105,
          "bridge": 50
        },
        "acceleration": {
          "default": 10000,
          "first_layer": 500,
          "perimeter": 0,
          "external_perimeter": 5000,
          "infill": "100%",
          "solid_infill": 0,
          "top_solid_infill": 2000,
          "travel": 10000,
          "bridge": 0
        },
        "overhang": {
          "enable_overhang_speed": true,
          "speed_0": 0,
          "speed_1": 50,
          "speed_2": 30,
          "speed_3": 10
        },
        "wipe_tower": {
          "enable": false,
          "width": 60
        },
        "output_options": {
          "spiral_vase": false,
          "print_sequence": "by layer"
        }
      }
    }
 const response = await fetch(
      `https://api.cloudslicer3d.com/v1/quote/${jsonObj.fileId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CLOUDSLICER_TOKEN.value()}`,
          "Content-Type": "application/json",
          "Connection": "close"
        },
        body: JSON.stringify(obj),
      }
    );

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return res.status(502).json({ error: "Cloudslicer error", details: text });
    }

    const data = await response.json();




    const partPrice = Math.round(Number(data?.pricing?.total_price ?? 0) * 9);
    const quantity = parseInt(jsonObj.quantity, 10) || 1;

    const startPrice = 150;
    const shippingCost = 129;

    const totalPrice = partPrice * quantity + startPrice + shippingCost;

    const quoteDoc = {
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "created",
      fileId: jsonObj.fileId,
      materialId: jsonObj.materialId,
      infill: jsonObj.infill,
      quantity,
      pricing: {
        partPrice,
        startPrice,
        shippingCost,
        totalPrice,
        currency: data?.pricing?.currency || "SEK",
      },
    };

    const docRef = await db.collection("quotes").add(quoteDoc);
    const quoteId = docRef.id;

    // 2) Returnera till klienten
    return res.status(200).json({
      partPrice,
      startPrice,
      quantity,
      shippingCost,
      totalPrice,
      quoteId,
    });

  } catch (e) {
  logger.error(e);
  return res.status(500).json({
    error: "Quote generation failed",
    details: e.message,
  });
}
})



app.post("/createPaymentLink", async (req, res) => {
  try {
    const quoteId = req.headers["x-quote-id"];
    const quoteSnap = await db.collection("quotes").doc(quoteId).get();
    const quote = quoteSnap.data();

    const stripe = new Stripe(STRIPE_TOKEN.value());

    const quantity = parseInt(quote?.quantity, 10) || 1;

    // All SEK (NOT öre)
    const partPriceSek = Number(quote?.pricing?.partPriceSek ?? quote?.pricing?.partPrice ?? 0);
    const startPriceSek = Number(quote?.pricing?.startPriceSek ?? 150);
    const shippingSek = Number(quote?.pricing?.shippingCostSek ?? 129);

    // Convert SEK -> öre safely (rounded to integer)
    const toOre = (sek) => Math.round(Number(sek) * 100);

const session = await stripe.checkout.sessions.create({
  mode: "payment",
  locale: "sv",
  payment_method_types: ["card", "klarna", "link"],

  automatic_tax: {
    enabled: true,
  },

  customer_creation: "always",
  billing_address_collection: "required",
  client_reference_id: quoteId,
  metadata: { quote_id: quoteId },

  line_items: [
    {
      quantity,
      price_data: {
        currency: "sek",
        unit_amount: toOre(partPriceSek),
        tax_behavior: "exclusive",
        product_data: {
          name: "Delkostnad",
          tax_code: "txcd_10000000",
          description: "Offert: " + quoteId
        },
      },
    },
    {
      quantity: 1,
      price_data: {
        currency: "sek",
        unit_amount: toOre(startPriceSek),
        tax_behavior: "exclusive",
        product_data: {
          name: "Startkostnad",
          tax_code: "txcd_10000000",
        },
      },
    },
    {
      quantity: 1,
      price_data: {
        currency: "sek",
        unit_amount: toOre(shippingSek),
        tax_behavior: "exclusive",
        product_data: {
          name: "Postnord frakt (2-3 dagar)",
          tax_code: "txcd_92010001", // Shipping tax code
        },
      },
    },
  ],

  success_url: "https://addio-11148.web.app/success",
  cancel_url: "https://addio-11148.web.app?cancelPayment=true",
});


    await quoteSnap.ref.update({
      stripeSessionId: session.id,
      stripeCheckoutUrl: session.url || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({ url: session.url });
  } catch (e) {
    logger.error("stripe_create_checkout_session_failed", e);
    return res.status(500).json({ error: e?.message || "Internal server error" });
  }
});



exports.api = onRequest(
  {
    cors: true,
    secrets: [CLOUDSLICER_TOKEN, STRIPE_TOKEN],
    timeoutSeconds: 60, 
  },
  app
);
