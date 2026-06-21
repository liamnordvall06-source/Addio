import React from 'react'
import styles from "./leftSidebarComponent.module.css"
import UploadFileComponent from './UploadFileComponent'
import MaterialsListComponent from './MaterialsListComponent'


const LeftSidebarComponent = () => {
  return (
    <div className={styles.leftSidebarContainer}>
        <UploadFileComponent />
        <MaterialsListComponent />
    </div>
  )
}

export default LeftSidebarComponent
