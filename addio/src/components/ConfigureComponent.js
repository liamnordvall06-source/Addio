import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ConfigureComponent.module.css";

const ConfigureComponent = () => {
  

  const handleSubmit = (e) => {
    e.preventDefault();

    

  };

  return (
    <div className={styles.mainContainer}>
      <form className={styles.innerContainer}>

        <h1>Specifikationer</h1>
        <label>Kvantitet</label>
        <input type="number" className={styles.configureInput}></input>
        <label>Material</label>
        <select className={styles.configureInput}></select>
        <label>Färg</label>
        <select className={styles.configureInput}></select>
        <label>Infill</label>
        <select className={styles.configureInput}></select>
        <label>Övriga ritningar</label>
        <p>Behöver du gänginsatser? Placera ut storleken på insatserna i ritningen. CAD-filen har prioritet över ritningarna ifall övriga specifikationer skiljer sig åt.</p>
        <div className={styles.fileBtn}>
          <label for="fileUpload">
            <span className={styles.uploadIcon}>⬆</span>
            Ladda upp
          </label>
          <input type="file" id="fileUpload" />
        </div>

        <label className={styles.finishText}>Slutför</label>
        <p className={styles.checkoutText}>Vill du gå till kassan och betala eller lägga till fler filer i din offert?</p>
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.checkoutBtn}>Checkout</button>
          <button type="submit" className={styles.addmoreBtn}>Lägg till fler</button>
        </div>
      </form>
    </div>
  );
};

export default ConfigureComponent;
