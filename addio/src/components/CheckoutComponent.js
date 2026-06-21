import React from 'react'
import styles from "./CheckoutComponent.module.css"
import { FaArrowRight } from "react-icons/fa6";
import { CiLock } from "react-icons/ci";

const CheckoutComponent = () => {
  return (
    <div className={styles.checkoutContainer}>
        <h1>Checkout</h1>

        <div className={styles.specificationContainer}>
            <ul>
                <li>
                    <p>Antal delar</p>
                    <h3>8 st</h3>
                </li>
                <li>
                    <p>Beräknad leveranstid</p>
                    <h3>4-6 arbetsdagar</h3>
                </li>
                <li>
                    <p>Rabatt</p>
                    <h3>10%</h3>
                </li>
            </ul>
        </div>

        <div className={styles.priceContainer}>
            <p>Pris (exkl. moms)</p>
            <h3>906 kr</h3>
        </div>
        <button className={styles.continueBtn}>
            <p>GÅ VIDARE</p>
            <FaArrowRight />
        </button>
        <button className={styles.saveQuoteBtn}>
            <p>SPARA OFFERT</p>
        </button>

        <div className={styles.divider}>
            <CiLock />
            <p className={styles.paymentInfo}>
                Säker och krypterad betalning
            </p>
        </div>

    </div>
  )
}

export default CheckoutComponent
