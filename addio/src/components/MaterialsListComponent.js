import React from 'react'
import styles from "./MaterialsListComponent.module.css";
import { IoFilter, IoSearch } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";


const MaterialsListComponent = () => {
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

        <ul>
          <li>
            <button className={styles.showAllMaterialsBtn}>
                <IoIosArrowDown />
                <p>Visa fler material</p>
            </button>
          </li>
        </ul>

      </div>
  )
}

export default MaterialsListComponent
