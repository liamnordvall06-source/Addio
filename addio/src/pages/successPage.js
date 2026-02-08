import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/headerComponent";
import styles from "./successPage.module.css";
import SuccessLogo from "../assets/success.png";

const SuccessPage = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate("/");
    };

    return (
        <div className={styles.mainContainer}>
            <HeaderComponent />
            <div className={styles.innerContainer}>
                <div className={styles.successContainer}>
                    <img src={SuccessLogo} alt="Payment success" />
                    <h1>Tack för din order!</h1>
                    <p>Din betalning har lyckats och vi börjar tillverka dina detaljer.</p>
                    <button onClick={handleRedirect}>Få en ny offert</button>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
