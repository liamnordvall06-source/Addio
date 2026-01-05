import React from "react";
import styles from "./configurePage.module.css";
import SidebarComponent from "../components/sidebarComponent";


const ConfigurePage = () => {
    return (
        <div className={styles.mainPage}>
            <SidebarComponent />
        </div>
    );
}


export default ConfigurePage;