import React from "react";
import styles from "./AdminCreateMaterialPage.module.css"
import AdminSidebarComponent from "../components/AdminSidebarComponent";
import CreateMaterialComponent from "../components/CreateMaterialComponent";


const AdminCreateMaterialPage = () => {
    return (
        <div className={styles.adminCreateMaterialContainer}>
            <AdminSidebarComponent />
            <div className={styles.mainContainer}>
                <CreateMaterialComponent />
            </div>
        </div>
    )
}


export default AdminCreateMaterialPage;