import React from "react";
import styles from "./AdminSidebarComponent.module.css";
import Logo from "../assets/BlackBrandLogo.png";
import { PiSignOutBold } from "react-icons/pi";
import { FiHome } from "react-icons/fi";
import { FiBox } from "react-icons/fi";
import { FiSend } from "react-icons/fi";


const AdminSidebarComponent = () => {
    return (
        <div className={styles.adminSidebarContainer}>


            <div className={styles.mainContainer}>
                <div className={styles.headerContainer}>
                    <img src={Logo} alt="BrandIt3D" />
                </div>
                <ul>
                    <li><h3>ÖVERSIKT</h3></li>
                    <li>
                        <div className={styles.sidebarElement}>
                            <FiHome />
                            <p>Dashboard</p>
                        </div>
                    </li>
                    <li><h3>HANTERA</h3></li>
                    <li>
                        <div className={styles.sidebarElement}>
                            <FiSend />
                            <p>Ordrar</p>
                        </div>
                    </li>
                                        <li>
                        <div className={styles.sidebarElement}>
                            <FiBox />
                            <p>Material</p>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div className={styles.footerContainer}>
                <div className={styles.signoutContainer}>
                    <PiSignOutBold />
                    <p>Logga ut</p>
                </div>
            </div>
        </div>
    )
}


export default AdminSidebarComponent;