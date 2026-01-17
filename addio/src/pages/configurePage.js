import React from "react";
import styles from "./configurePage.module.css";
import SidebarComponent from "../components/sidebarComponent";
import ConfigureComponent from "../components/ConfigureComponent.js";
import UploadCADComponent from "../components/uploadCADCompnent.js";
import STLViewerComponent from "../components/STLViewerComponent.js";

const ConfigurePage = () => {
  return (
    <div className={styles.mainContainer}>
      {/* SIDEBAR */}
      <SidebarComponent />

      {/* MAIN CONTENT */}
      <div className={styles.mainContentContainer}>
        {/* VÄNSTER KOLUMN */}
        <div className={styles.leftColumn}>
          <ConfigureComponent />
        </div>

        {/* DIVIDER */}
        <div className={styles.verticalDivider} />

        {/* HÖGER KOLUMN */}
        <div className={styles.rightColumn}>
          <div className={styles.viewerWrapper}>
            <STLViewerComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurePage;
