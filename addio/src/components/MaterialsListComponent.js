import React from 'react'
import styles from "./MaterialsListComponent.module.css";
import { IoFilter, IoSearch } from "react-icons/io5";
import { CiCircleQuestion } from "react-icons/ci";


const MaterialsListComponent = () => {
  return (
    <div className={styles.materialListContainer}>
        <h1>Välj material</h1>
        <div className={styles.inputForm}>

            <div className={styles.searchContainer}>
                <IoSearch />
                <input type="text" className={styles.searchField} placeholder="Sök material..."></input>
            </div>
           
            <button className={styles.filterBtn}><IoFilter /></button>
        </div>

        
    </div>
  )
}

export default MaterialsListComponent
