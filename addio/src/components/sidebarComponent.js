import React, { useEffect } from "react";
import styles from "./sidebarComponent.module.css";
import LogoImage from "../assets/Logo.png";


const SidebarComponent = () => {

    // useEffect(() => {
    //     const test = async () => {
    //         const res = await fetch("https://europe-west1-addio-11148.cloudfunctions.net/api/materials", {
    //             method: "GET",
    //         });

    //         console.log(res);
    //     }

    //     test();
    // }, [])

    return (
        <div className={styles.mainContainer}>
            <div className={styles.headerContainer}>
                <img src={LogoImage} alt="BrandIt3D" />
            </div>
        </div>
    );
}


export default SidebarComponent;
