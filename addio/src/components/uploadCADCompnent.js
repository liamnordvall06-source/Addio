import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./uploadCADComponent.module.css";
import STLViewerComponent from "./STLViewerComponent";

import { storage } from "../middleware/firebase"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const UploadCADComponent = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleFileUpload = async () => {
    if (!file || uploading) return;

    setUploading(true);
    setError("");

    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "stl";
      const id = uuidv4();

      // OBS: du skrev "qoutes" – jag behåller exakt samma
      const path = `qoutes/${id}.${ext}`;
      const fileRef = ref(storage, path);

      const metadata = {
        contentType: file.type || "application/sla",
        customMetadata: {
          originalName: file.name,
          uuid: id,
        },
      };

      await uploadBytes(fileRef, file, metadata);
      const url = await getDownloadURL(fileRef);

      // 👉 Navigera till /configure och skicka med data
      navigate("/configure", {
        state: {
          fileId: id,
          filePath: path,
          downloadUrl: url,
          originalName: file.name,
        },
      });
    } catch (e) {
      console.error(e);
      setError("Uppladdningen misslyckades. Försök igen.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <h1>Ladda upp CAD-modellen och få en offert</h1>

      {file ? (
        <STLViewerComponent
          file={file}
          onFileChange={setFile}
          onFileNameChange={() => {}}
        />
      ) : (
        <label className={styles.dropzone}>
          <input
            type="file"
            accept=".stl"
            className={styles.hiddenInput}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <div className={styles.content}>
            <div className={styles.icon}>↑</div>
            <p>Klicka för att ladda upp</p>
            <p className={styles.supported}>Stöder: .stl</p>
          </div>
        </label>
      )}

      <button
        className={styles.continueBtn}
        disabled={!file || uploading}
        onClick={handleFileUpload}
      >
        {uploading ? "Laddar upp..." : "Fortsätt"}
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default UploadCADComponent;
