import React from "react";
import styles from "./configurePage.module.css";
import SidebarComponent from "../components/sidebarComponent";
import ConfigureComponent from "../components/ConfigureComponent.js";
import UploadCADComponent from "../components/uploadCADCompnent.js";
import STLViewerComponent from "../components/STLViewerComponent.js";


const ConfigurePage = () => {
    return (
        <div className={styles.mainContainer}>
            <SidebarComponent />

            <div className={styles.mainContentContainer}>
                <div className={styles.contentRow}>
                    <ConfigureComponent />

                    <div className={styles.verticalDivider} />

                    <div className={styles.viewerWrapper}>
                        <STLViewerComponent />
                    </div>


                </div>
            </div>
        </div>
    );
}


export default ConfigurePage;