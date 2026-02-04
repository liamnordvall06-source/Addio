import styles from "./sidebarComponent.module.css";
import LogoImage from "../assets/Logo.png";
import { useEffect } from "react";


const SidebarComponent = () => {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.headerContainer}>
                <img src={LogoImage} alt="BrandIt3D" />
                
            </div>
        </div>
    );
}


export default SidebarComponent;


// https://api.cloudslicer3d.com
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZmMzN2YxMzUtMzRlOC00YzA4LThiY2YtNDQ3YWJmY2MyYzMyIiwiZW1haWwiOiJsaWFtbm9yZHZhbGwwNkBnbWFpbC5jb20iLCJ0b2tlbl9pZCI6IjFiN2ZlZTU2LTZhYTEtNDAxMC04NDMwLWYzNjhiOGRjNTQwNSIsIm5hbWUiOiJRb3V0YXRpb25Ub2tlbiJ9.YC_HGgSzeDqOimtedu3k2B2Vx5IjL9uiYPvkk157rQI