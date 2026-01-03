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

                <button
                    className={getButtonClass("SLA")}
                    onClick={() => setSelectedTech("SLA")}
                >
                    <img src={SLALogo} alt="SLA" />
                    <div className={styles.textContainer}>
                        <h3>Stereolithography</h3>
                        <p>SLA (200 x 200 x 150 mm)</p>
                    </div>
                </button>

                <button
                    className={getButtonClass("SLS")}
                    onClick={() => setSelectedTech("SLS")}
                >
                    <img src={SLSLogo} alt="SLS" />
                    <div className={styles.textContainer}>
                        <h3>Selective Laser Sintering</h3>
                        <p>SLS (300 x 200 x 250 mm)</p>
                    </div>
                </button>

                <div className={styles.laserEngravingBox}>
                    <div className={styles.textContainer}>
                        <h3>Lasermärkning</h3>
                        <p>
                            Prata med vårat säljteam om du behöver märkning på
                            dina detaljer. Vi använder UV-teknik för att
                            gravera på dina detaljer.{" "}
                            <a href="/" className={styles.learnMoreBtn}>
                                Läs mer
                            </a>
                        </p>
                        <button className={styles.getStartedBtn}>
                            Kom igång
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChooseTechnologyComponent;
