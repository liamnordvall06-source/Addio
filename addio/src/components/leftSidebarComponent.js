import React from 'react'
import styles from "./leftSidebarComponent.module.css"
import UploadFileComponent from './UploadFileComponent'


const LeftSidebarComponent = () => {
  return (
    <div className={styles.leftSidebarContainer}>
        <UploadFileComponent />
    </div>
  )
}

export default LeftSidebarComponent
