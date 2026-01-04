import styles from "./mainPage.module.css";
import SidebarComponent from "../components/sidebarComponent";
import ChooseTechnologyComponent from "../components/chooseTechnologyComponent";
import UploadCADComponent from "../components/uploadCADCompnent";

const MainPage = () => {
  return (
    <div className={styles.mainContainer}>
      <SidebarComponent />

      <div className={styles.mainContentContainer}>
        <div className={styles.contentRow}>
          <ChooseTechnologyComponent />

          <div className={styles.verticalDivider} />

          <UploadCADComponent />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
