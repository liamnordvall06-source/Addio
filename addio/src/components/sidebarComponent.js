import styles from "./sidebarComponent.module.css";
import LogoImage from "../assets/Logo.png";


const SidebarComponent = () => {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.headerContainer}>
                <img src={LogoImage} alt="BrandIt3D" />
            </div>
        </div>
    );
}


export default SidebarComponent;
    