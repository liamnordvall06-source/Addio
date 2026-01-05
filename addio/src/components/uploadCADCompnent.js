import React, { useState } from "react";
import styles from "./uploadCADComponent.module.css";
import STLViewerComponent from "./STLViewerComponent";

const UploadCADComponent = () => {
  const [file, setFile] = useState(null);

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
           <div className="Batch">
            hej
           </div>
        
        </label>
       
        

      )}

      <button className={styles.continueBtn} disabled={!file}>
        Fortsätt
      </button>
    
    </div>
  );
};

export default UploadCADComponent;
