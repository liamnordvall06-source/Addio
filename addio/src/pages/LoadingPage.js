import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./LoadingPage.module.css";
import LoadingComponent from "../components/LoadingComponent";

import { storage } from "../middleware/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const START_DELAY_MS = 900;

const LoadingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const file = location.state?.file || null;
  const startedRef = useRef(false);

  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("Laddar upp din modell...");
  const [error, setError] = useState("");

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (!file) {
      setError("Ingen fil hittades. Gå tillbaka och välj en STL-fil.");
      return;
    }

    const run = async () => {
      try {
        setError("");
        setProgress(0);
        setText("Förbereder...");

        // ✅ delay så man hinner se din animation
        await new Promise((r) => setTimeout(r, START_DELAY_MS));

        setText("Laddar upp din modell...");

        const ext = file.name.split(".").pop()?.toLowerCase() || "stl";
        const id = uuidv4();

        sessionStorage.setItem("cadUploadUUID", id);

        const path = `qoutes/${id}.${ext}`;
        const fileRef = ref(storage, path);

        const metadata = {
          contentType: file.type || "application/sla",
          customMetadata: { originalName: file.name, uuid: id },
        };

        const uploadTask = uploadBytesResumable(fileRef, file, metadata);

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
            sessionStorage.setItem("cadOriginalName", file.name);
            sessionStorage.setItem("cadFilePath", path);

            setText("Klart! Skickar vidare...");

            navigate("/configure", {
              state: {
                downloadUrl: url,
                originalName: file.name,
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
  }, [file, navigate]);

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
