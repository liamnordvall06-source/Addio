import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./uploadCADComponent.module.css";
import STLViewerComponent from "./STLViewerComponent";

const UploadCADComponent = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const goNext = () => {
    if (!file) return;
    navigate("/loading", { state: { file } });
  };

  return (
    <div className={styles.mainContainer}>
      <h1>Ladda upp CAD-modellen och få en offert</h1>

      {file ? (
        <STLViewerComponent
          file={file}
          locked={false}
          onFileChange={setFile}
          onFileNameChange={() => {}}
          showBadge={true}
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

      <button className={styles.continueBtn} disabled={!file} onClick={goNext}>
        Fortsätt
      </button>
    </div>
  );
};

export default UploadCADComponent;
