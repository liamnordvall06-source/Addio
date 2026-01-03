const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const multer = require("multer");
const os = require("os");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");

setGlobalOptions({ maxInstances: 10 });

const app = express();


app.get("/materials", async (req, res) => {
  try {
    const snapshot = await db.collection("materials").get();
    const materials = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json({ materials });
  } catch (err) {
    logger.error("api_error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

exports.api = onRequest(
  {
    region: "europe-west1",
    cors: true,
  },
  app
);
