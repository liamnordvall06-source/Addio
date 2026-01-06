import React from "react";
import styles from "./configurePage.module.css";
import SidebarComponent from "../components/sidebarComponent";
import ConfigureComponent from "../components/ConfigureComponent.js";


const ConfigurePage = () => {
    return (
        <div className={styles.mainPage}>
            {/* <SidebarComponent /> */}
            <ConfigureComponent />
        </div>
    );
}


export default ConfigurePage;