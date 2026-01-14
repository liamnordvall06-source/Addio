import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./LoadingPage.module.css";
import LoadingComponent from "../components/LoadingComponent";

import { storage } from "../middleware/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const START_DELAY_MS = 900;

function guessContentTypeFromName(name) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "stl") return "model/stl";
  return "application/octet-stream";
}

async function fileFromObjectUrl(objectUrl, fileName) {
  const res = await fetch(objectUrl);
  if (!res.ok) throw new Error("Kunde inte läsa filen från object URL.");
  const blob = await res.blob();
  const type = blob.type && blob.type !== "application/octet-stream"
    ? blob.type
    : guessContentTypeFromName(fileName || "model.stl");

  // Skapa File om möjligt (för name/type), annars Blob räcker för uploadBytesResumable
  try {
    return new File([blob], fileName || "model.stl", { type });
  } catch {
    blob.name = fileName || "model.stl";
    blob.type = type;
    return blob;
  }
}

const LoadingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Stöd båda varianter:
  const file = location.state?.file || null;
  const stlUrl = location.state?.stlUrl || "";
  const fileName = location.state?.fileName || "";

  const startedRef = useRef(false);

  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("Laddar upp din modell...");
  const [error, setError] = useState("");

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      try {
        setError("");
        setProgress(0);
        setText("Förbereder...");

        await new Promise((r) => setTimeout(r, START_DELAY_MS));

        // 1) Välj källa för filen
        let uploadable = file;

        // Om vi inte har file men har stlUrl → bygg en fil via fetch
        if (!uploadable && stlUrl) {
          setText("Förbereder fil...");
          uploadable = await fileFromObjectUrl(stlUrl, fileName);
        }

        if (!uploadable) {
          setError("Ingen fil hittades. Gå tillbaka och välj en STL-fil.");
          return;
        }

        setText("Laddar upp din modell...");

        const name = uploadable.name || fileName || "model.stl";
        const ext = name.split(".").pop()?.toLowerCase() || "stl";
        const id = uuidv4();

        sessionStorage.setItem("cadUploadUUID", id);

        const path = `qoutes/${id}.${ext}`;
        const fileRef = ref(storage, path);

        const metadata = {
          contentType: uploadable.type || guessContentTypeFromName(name),
          customMetadata: { originalName: name, uuid: id },
        };

        const uploadTask = uploadBytesResumable(fileRef, uploadable, metadata);

        uploadTask.on(
          "state_changed",
          (snap) => {
            const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
            setProgress(pct);

            if (pct < 70) setText("Laddar upp din modell...");
            else if (pct < 95) setText("Nästan klar...");
            else setText("Slutför...");
          },
          (err) => {
            console.error(err);
            setError("Uppladdningen misslyckades. Försök igen.");
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);

            sessionStorage.setItem("cadDownloadUrl", url);
            sessionStorage.setItem("cadOriginalName", name);
            sessionStorage.setItem("cadFilePath", path);

            setText("Klart! Skickar vidare...");

            navigate("/configure", {
              state: {
                downloadUrl: url,
                originalName: name,
                filePath: path,
                fileId: id,
              },
              replace: true,
            });
          }
        );
      } catch (e) {
        console.error(e);
        setError("Uppladdningen misslyckades. Försök igen.");
      }
    };

    run();
  }, [file, stlUrl, fileName, navigate]);

  return (
    <div className={styles.Load}>
      <LoadingComponent text={`${text}${progress ? ` (${progress}%)` : ""}`} />

      {error && (
        <div className={styles.errorWrap}>
          <div className={styles.error}>{error}</div>
          <button className={styles.backBtn} onClick={() => navigate("/")}>
            Tillbaka
          </button>
        </div>
      )}
    </div>
  );
};

export default LoadingPage;
