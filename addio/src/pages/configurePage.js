import React from "react";
import styles from "./configurePage.module.css";
import SidebarComponent from "../components/sidebarComponent";
import STLViewerComponent from "../components/STLViewerComponent";


const ConfigurePage = () => {
    return (
        <div className={styles.mainPage}>
            <STLViewerComponent />
        </div>
    );
}


export default ConfigurePage;