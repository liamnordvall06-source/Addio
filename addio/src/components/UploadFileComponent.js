import React from 'react'
import styles from "./UploadFileComponent.module.css"
import { AiOutlineCloudUpload } from "react-icons/ai";


const UploadFileComponent = () => {
  return (

  <div className={styles.uploadCard}>
      <h1>Ladda upp fil</h1>
      <div className={styles.dropZone}>
        <AiOutlineCloudUpload className={styles.uploadLogo}/>
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
