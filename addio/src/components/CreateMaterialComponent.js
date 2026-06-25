import React from "react";
import styles from "./CreateMaterialComponent.module.css";


const CreateMaterialComponent = () => {
    return (
        <div className={styles.createMaterialContainer}>
            <div className={styles.subContainer}>
                <div className={styles.headerContainer}>
                    <h1>Skapa material</h1>
                    <p>Fyll i information för att skapa ett nytt material</p>
                </div>
                <div className={styles.mainContainer}>
                    <div className={styles.informationContainer}>
                        <h3>Grundinformation</h3>
                        <label>Materialnamn</label>
                        <input type="text" placeholder="t.ex PA6-CF"></input>
                        <label>Typ</label>
                        <input type="text" placeholder="t.ex FDM"></input>
                        <label>Beskrivning</label>
                        <input type="text" placeholder="t.ex Kolfiberförstärkt nylon"></input>

                    </div>
                    <div className={styles.informationContainer}>
                        <h3>Utseende och pris</h3>   
                        <label>Färg</label>
                        <input type="color"></input>
                        <label>Pris (kr/kg)</label>
                        <input type="text"></input>
                        <label>Densitet (g/cm3)</label>
                        <input type="text"></input>
                    </div>
                    <div className={styles.informationContainer}>
                        <h3>Egenskaper</h3>
                        <label>Stryka</label>
                        <input type="text"></input>
                        <label>Styvhet</label>
                        <input type="text"></input>
                        <label>Värmetålighet</label>
                        <input type="text"></input>
                        <label>Slagtålighet</label>
                        <input type="text"></input>
                        <label>Kemikalieresistens</label>
                        <input type="text"></input>
                    </div>
                    <div className={styles.informationContainer}>
                        <h3>Filament Information</h3>
                        <label>Tillverkare</label>
                        <input type="text"></input>
                        <label>Rekommenderad munstyckestemperatur C°</label>
                        <input type="text"></input>
                        <label>Rekommenderad bäddtemperatur C°</label>
                        <input type="text"></input>
                    </div>
                </div>
                <div className={styles.footerContainer}>
                    <button className={styles.cancelBtn}>Avbryt</button>
                    <button className={styles.createMaterialBtn}>Skapa material</button>
                </div>
            </div>
        </div>
    )
}


export default CreateMaterialComponent;