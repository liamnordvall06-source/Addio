import React from 'react'
import styles from "./MaterialCardComponent.module.css";
import { FaStar } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";


const MaterialCardComponent = ({ isRecommended = false }) => {
  return (
    <div className={styles.materialCardContainer}>


        <div className={styles.materialHeader}>
            <h3>PA6-CF</h3>
        </div>
        <div className={styles.materialInfo}>
            <p>Kolfiberförstärkt nylon</p>
        </div>
        <div className={styles.materialFooter}>
            <div className={styles.badgeContainer}>
                <div className={styles.badge}>
                        <p>FDM</p>
                    </div>
                    {isRecommended && (
                    <div className={styles.recommendedBadge}>
                        <FaStar />
                        <p>Rekommenderat</p></div>
                    )}
                </div>
          
            <a href="/" className={styles.readMoreLink}>
                <p>Läs mer</p>
                <FaArrowRight />
            </a>
        </div>
    </div>
  )
}

export default MaterialCardComponent
