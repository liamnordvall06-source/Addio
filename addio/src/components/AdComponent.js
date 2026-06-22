import React from "react";
import styles from "./AdComponent.module.css";
import { TbDiamondFilled } from "react-icons/tb";


const AdComponent = () => {
    return (
        <div className={styles.adContainer}>
            <span>
                <TbDiamondFilled className={styles.logo}/>
                <h3>PREMIUM MATERIAL</h3>
            </span>
            
            
            <h1>Upptäck våra <br/> högkvalitativa material</h1>
            <p>Utvalda material för maximal prestanda, hållbarhet och precision</p>
            <button className={styles.readMoreBtn}>Läs mer</button>
        </div>
    )
}


export default AdComponent;