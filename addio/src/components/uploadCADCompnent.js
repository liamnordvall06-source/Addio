import React from "react";
import styles from "./uploadCADComponent.module.css";

const UploadCADComponent = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.innerContainer}>
        <h1>Ladda upp CAD-modellen och få en offert</h1>

        <div
          className={styles.dropzone}
          role="button"
          tabIndex={0}
          aria-disabled={false}
        >
          <input
            type="file"
            accept=".stl"
            className={styles.hiddenInput}
            disabled={false}
            onChange={() => {}}
          />

          <div className={styles.content}>
            <div className={styles.icon}>↑</div>

            <p className={styles.text}>
              Drag and drop here or <span className={styles.link}>select</span>
            </p>

            <p className={styles.supported}>Stöder: .stl</p>
          </div>
        </div>
      </div>
      <button className={styles.continueBtn}>Fortsätt</button>
    </div>
  );
};

export default UploadCADComponent;
