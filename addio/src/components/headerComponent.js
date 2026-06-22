import React from 'react'
import styles from "./headerComponent.module.css"
import BrandLogo from "../assets/BlackBrandLogo.png"
import { GrLanguage } from "react-icons/gr";


const HeaderComponent = () => {
  return (
    <div className={styles.mainHeaderContainer}>
        <div className={styles.innerContainer}>
            <img src={BrandLogo} alt="BrandIt3D" />
            
            <div className={styles.progressContainer}>

            </div>
            <div className={styles.buttonContainer}>
              <a href="/">Hjälp</a>
              <GrLanguage className={styles.languageContainer}/>
              <button className={styles.signUpBtn}>Skapa ett konto</button>
              <button className={styles.signInBtn}>Logga in</button>
            </div>
        </div>
    </div>
  )
}

export default HeaderComponent
