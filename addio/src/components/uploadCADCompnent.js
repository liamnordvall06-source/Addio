import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./uploadCADComponent.module.css";
import STLViewerComponent from "./STLViewerComponent";
import { storage } from "../middleware/firebase"; // adjust path
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UploadCADComponent = () => {
  const [file, setFile] = useState(null);
  const [fileBody, setFileBody] = useState(null);
  const navigate = useNavigate();

const goNext = async () => {
  if (!file || !fileBody) return;

    try {
      const ext = file.name.split(".").pop();
      const storageFileName = `uploads/${crypto.randomUUID()}.${ext}`;

      const storageRef = ref(storage, storageFileName);
      await uploadBytes(storageRef, file);

      const downloadUrl = await getDownloadURL(storageRef);

      sessionStorage.setItem("uploadedFilePath", storageFileName);
      sessionStorage.setItem("uploadedFileName", storageFileName.split("/").pop());
      sessionStorage.setItem("uploadedFileUrl", downloadUrl);

      navigate("/configure", {
        state: { filePath: storageFileName, fileUrl: downloadUrl },
      });
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
