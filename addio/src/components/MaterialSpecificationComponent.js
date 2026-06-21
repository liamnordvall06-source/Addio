import React from 'react'
import styles from "./MaterialSpecificationComponent.module.css";
import { GrCircleInformation } from "react-icons/gr";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";

const MaterialSpecificationComponent = () => {
  return (
    <div className={styles.materialSpecificationContainer}>
      <h3>Valt material</h3>
      <h1>PA6-CF</h1>
      <p>Kolfiberförstärkt nylon</p>

      <div className={styles.badgeContainer}>
          <div className={styles.badge}>
              <p>FDM</p>
          </div>

          <div className={styles.colorContainer}>
            <div className={styles.colorSphere}></div>
            <p>Svart</p>
          </div>
      </div>

      <button className={styles.moreMaterialSpecBtn}>
          <GrCircleInformation />
          <p>Läs mer om materialet</p>
      </button>

      <div className={styles.informationContainer}>
        <h3>Egenskaper</h3>
        <ul className={styles.specificationContainer}>
        <li>
          <p>Styrka</p>

          <div className={styles.dots}>
            {[1, 2, 3, 4, 5].map((dot) => {
              const value = 3;
              const fill = Math.max(0, Math.min(1, value - (dot - 1))) * 100;

              return (
                <span
                  key={dot}
                  className={styles.dot}
                  style={{ "--fill": `${fill}%` }}
                />
              );
            })}
          </div>
        </li>
          
          <li>
              <p>Styvhet</p>

              <div className={styles.dots}>
                {[1, 2, 3, 4, 5].map((dot) => {
                  const value = 4.5;
                  const fill = Math.max(0, Math.min(1, value - (dot - 1))) * 100;

                  return (
                    <span
                      key={dot}
                      className={styles.dot}
                      style={{ "--fill": `${fill}%` }}
                    />
                  );
                })}
              </div>
          </li>
          <li>
             <p>Värmetålighet</p>

            <div className={styles.dots}>
            {[1, 2, 3, 4, 5].map((dot) => {
              const value = 5;
              const fill = Math.max(0, Math.min(1, value - (dot - 1))) * 100;

              return (
                <span
                  key={dot}
                  className={styles.dot}
                  style={{ "--fill": `${fill}%` }}
                />
              );
            })}
          </div>
          </li>
          <li>
             <p>Slagtålighet</p>
                       <div className={styles.dots}>
            {[1, 2, 3, 4, 5].map((dot) => {
              const value = 3.7;
              const fill = Math.max(0, Math.min(1, value - (dot - 1))) * 100;

              return (
                <span
                  key={dot}
                  className={styles.dot}
                  style={{ "--fill": `${fill}%` }}
                />
              );
            })}
          </div>
          </li>
          <li>
             <p>Kemikalieresistens</p>
                       <div className={styles.dots}>
            {[1, 2, 3, 4, 5].map((dot) => {
              const value = 2.5;
              const fill = Math.max(0, Math.min(1, value - (dot - 1))) * 100;

              return (
                <span
                  key={dot}
                  className={styles.dot}
                  style={{ "--fill": `${fill}%` }}
                />
              );
            })}
          </div>
          </li>          
        </ul>

        <h3>Fördelar</h3>
        <ul className={styles.prosContainer}>
          <li>
            <FaCheckCircle />
            <p>Hög styrka och styvhet</p>
          </li>
          <li>
          <FaCheckCircle />
            <p>Mycket god värmetålighet</p>
          </li>
          <li>
           <FaCheckCircle />
            <p>Slitstarkt och stabilt</p>
          </li>
          <li>
            <FaCheckCircle />
            <p>Bra dimenionsstabilitet</p>
          </li>
        </ul>

        <h3>Att tänka på</h3>
        <ul className={styles.consContainer}>
          <li>
            <IoIosWarning />
            <p>Kan absorbera fukt</p>
          </li>
          <li>
            <IoIosWarning />
            <p>Högre pris än standardmaterial</p>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default MaterialSpecificationComponent
