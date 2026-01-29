import React, { useState } from "react";
import styles from "./chooseTechnologyComponent.module.css";
import SLALogo from "../assets/SLALogo.png";
import FDMLogo from "../assets/FDMLogo.png";
import SLSLogo from "../assets/SLSLogo.png";

const ChooseTechnologyComponent = () => {
    const [selectedTech, setSelectedTech] = useState(null);

    const getButtonClass = (tech) =>
        `${styles.processBtn} ${
            selectedTech === tech ? styles.selected : ""
        }`;

    return (
        <div className={styles.mainContainer}>
            <div className={styles.innerContainer}>
                <h1>Välj teknik</h1>

                <button
                    className={getButtonClass("FDM")}
                    onClick={() => setSelectedTech("FDM")}
                >
                    <img src={FDMLogo} alt="FDM" />
                    <div className={styles.textContainer}>
                        <h3>Fused Deposition Modeling</h3>
                        <p>FDM (350 x 350 x 350 mm)</p>
                    </div>
                </button>


                <div className={styles.laserEngravingBox}>
                    <div className={styles.textContainer}>
                        <h3>Andra tekniker?</h3>
                        <p>
                            Prata med vårat säljteam om du behöver andra tekniker för dina utskrifter.
                            
                            {" "}
                            <a href="https://brandit3d.com/" className={styles.learnMoreBtn}>
                                Läs mer
                            </a>
                        </p>
                        <button className={styles.getStartedBtn}>
                            Kontaka oss
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChooseTechnologyComponent;
