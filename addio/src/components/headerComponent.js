import React from 'react'
import styles from "./headerComponent.module.css"
import BrandLogo from "../assets/BlackBrandLogo.png"


const HeaderComponent = () => {
  return (
    <div className={styles.mainHeaderContainer}>
        <div className={styles.innerContainer}>
            <img src={BrandLogo} alt="BrandIt3D" />
            
            <div className={styles.progressContainer}>

            </div>

            <button className={styles.signInBtn}>Logga in</button>
        </div>
    </div>
  )
}

export default HeaderComponent
