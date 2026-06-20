import React from 'react'
import styles from "./UploadFileComponent.module.css"

const UploadFileComponent = () => {
  return (
  <div className={styles.uploadCard}>
      <div className={styles.dropZone}>

        <p className={styles.uploadText}>Dra och släpp dina filer här</p>
        <span className={styles.orText}>eller</span>

        <button className={styles.uploadButton} type="button">
          VÄLJ FILER
        </button>
      </div>

      <div className={styles.uploadFooter}>
        <p>Stödda format: STL, STEP, OBJ, 3MF</p>
        <p>Max filstorlek: 500 MB per fil</p>
      </div>
    </div>
  )
}

export default UploadFileComponent
