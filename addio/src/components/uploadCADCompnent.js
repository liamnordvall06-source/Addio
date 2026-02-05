import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./uploadCADComponent.module.css";
import STLViewerComponent from "./STLViewerComponent";
import { storage } from "../middleware/firebase"; // adjust path
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";


const UploadCADComponent = () => {
  const [file, setFile] = useState(null);
  const [fileBody, setFileBody] = useState(null);
  const navigate = useNavigate();


const goNext = async () => {
  if (!file) return;

  try {
    // 1) Keep extension, but sanitize/whitelist
    const rawExt = (file.name.split(".").pop() || "").toLowerCase();
    const allowed = new Set(["stl", "step", "stp", "3mf", "obj"]);
    const ext = allowed.has(rawExt) ? rawExt : "stl";

    // 2) Build a safe storage path (this is what your backend must download)
    const newFileName = `${uuidv4()}.${ext}`;
    const storagePath = `uploads/${newFileName}`; // <- IMPORTANT: define it

    // 3) Upload to Firebase Storage
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file, {
      contentType: file.type || "application/octet-stream",
    });

    // 4) Tell backend where it is + what name to use for /tmp
    const response = await fetch("https://api-iinmezl24q-uc.a.run.app/file", {
      method: "POST",
      headers: {
        "X-Storage-Path": storagePath,   // <- use the path you uploaded to
        "X-File-Name": newFileName,      // <- safe filename for tmp + Cloudslicer
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Request failed: ${response.status} - ${text}`);
    }

    const data = await response.json();
    sessionStorage.setItem("fileId", data.file_id);
    navigate("/configure");
  } catch (err) {
    console.error("Upload failed:", err);
  }
};



  const handleFileChange = (selectedFile) => {
    if (!selectedFile) {
      setFile(null);
      setFileBody(null);
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      setFileBody(reader.result);
    };

    reader.readAsText(selectedFile);
  };

  return (
    <div className={styles.mainContainer}>
      <h1>Ladda upp CAD-modellen och få en offert</h1>

      {file ? (
        <STLViewerComponent
          file={file}
          locked={false}
          showBadge={true}
          showClear={true}
          onFileChange={handleFileChange}
          onFileNameChange={() => {}}
          onClear={() => handleFileChange(null)}
        />
      ) : (
        <label className={styles.dropzone}>
          <input
            type="file"
            accept=".stl"
            className={styles.hiddenInput}
            onChange={(e) =>
              handleFileChange(e.target.files?.[0] || null)
            }
          />
          <div className={styles.content}>
            <div className={styles.icon}>↑</div>
            <p>Klicka för att ladda upp</p>
            <p className={styles.supported}>Stöder: .stl</p>
          </div>
        </label>
      )}

      <button className={styles.continueBtn} disabled={!file || !fileBody} onClick={goNext}>
        Fortsätt
      </button>

    </div>
  );
};

export default UploadCADComponent;
