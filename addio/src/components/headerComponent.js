import React from "react";
import styles from "./headerComponent.module.css";
import BrandLogo from "../assets/BlackLogo.png";


const HeaderComponent = () => {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.bannerContainer}></div>
            <div className={styles.headerContainer}>
                <div className={styles.innerContainer}>
                    <img src={BrandLogo} />
                </div>
            </div>
        </div>
    );
}


export default HeaderComponent;