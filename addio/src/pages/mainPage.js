import React from 'react'
import HeaderComponent from '../components/headerComponent'
import styles from "./mainPage.module.css"
import LeftSidebarComponent from '../components/leftSidebarComponent'
import ViewerComponent from '../components/ViewerComponent'
import FilesListComponent from '../components/FilesListComponent'
import MaterialSpecificationComponent from '../components/MaterialSpecificationComponent'

const MainPage = () => {
  return (
    <div className={styles.mainPageContainer}>
      <HeaderComponent />
      <div className={styles.mainContent}>
        <div className={styles.leftContainer}>
          <LeftSidebarComponent />
        </div>

        <div className={styles.middleContainer}>
          <ViewerComponent />
          <FilesListComponent />
        </div>

        <div className={styles.rightContainer}>
            <MaterialSpecificationComponent />
        </div>
      </div>
    </div>
  )
}

export default MainPage
