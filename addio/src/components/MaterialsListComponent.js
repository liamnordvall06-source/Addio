import React, { useState } from 'react'
import styles from "./MaterialsListComponent.module.css";
import { IoFilter, IoSearch } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import MaterialCardComponent from './MaterialCardComponent';


const MaterialsListComponent = () => {
  const [expanded, setExpanded] = useState(false);
  const defaultVisible = 4;

  // Placeholder materials list (can be replaced with real data later)
  const materials = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    isRecommended: i === 0,
  }));

  const visibleMaterials = expanded ? materials : materials.slice(0, defaultVisible);

  return (
    <div className={styles.materialListContainer}>
        <h1>Välj material</h1>
        <p>Utforska våra högkvalitativa material för professionella resultat</p>
        <div className={styles.inputForm}>

            <div className={styles.searchContainer}>
                <IoSearch />
                <input type="text" className={styles.searchField} placeholder="Sök material..."></input>
            </div>
           
            <button className={styles.filterBtn}><IoFilter /></button>
        </div>

        <div className={styles.listWrapper}>
          <ul>
            {visibleMaterials.map((m) => (
              <li key={m.id}>
                <MaterialCardComponent isRecommended={m.isRecommended} />
              </li>
            ))}
          </ul>
          {materials.length > defaultVisible && (
            <div className={styles.showAllMaterialsBtnWrapper}>
              <button
                aria-expanded={expanded}
                onClick={() => setExpanded((s) => !s)}
                className={styles.showAllMaterialsBtn}
              >
                {expanded ? <IoIosArrowUp /> : <IoIosArrowDown />}
                <p>{expanded ? 'Visa färre material' : 'Visa fler material'}</p>
              </button>
            </div>
          )}
        </div>

      </div>
  )
}

export default MaterialsListComponent
