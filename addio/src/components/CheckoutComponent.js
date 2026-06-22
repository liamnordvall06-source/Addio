import React from 'react'
import styles from "./CheckoutComponent.module.css"
import { FaArrowRight } from "react-icons/fa6";
import { CiLock } from "react-icons/ci";
import {
  VisaLogoIcon,
  MastercardLogoIcon ,
  PaypalIcon 
} from "react-svg-credit-card-payment-icons";
import KlarnaIcon from "../assets/Klarna_Payment_Badge.svg"
import { MdOutlineDiscount } from "react-icons/md";
import { GoPackage } from "react-icons/go";
import { FaCheckCircle } from "react-icons/fa";

const CheckoutComponent = () => {
  return (
    <div className={styles.checkoutContainer}>
        <h1>SAMMANFATTNING</h1>

        <div className={styles.specificationContainer}>
            <ul>
                <li>
                    <span>
                        <GoPackage />
                        <p>Beräknad leveranstid</p>
                    </span>

                    <h3>4-6 arbetsdagar</h3>
                </li>
                <li>
                    <span>
                        <MdOutlineDiscount />
                        <p>Rabatt</p>
                    </span>
                    <h3>10%</h3>
                </li>
            </ul>
        </div>

        <div className={styles.priceContainer}>
            <p>Pris (exkl. moms)</p>
            <h3>906 kr</h3>
        </div>

        <div className={styles.consContainer}>
            <ul>
                <li>
                    <FaCheckCircle />
                    <p>Säker och krypterad betalning</p>
                </li>
                <li>
                    <FaCheckCircle />
                    <p>Kvalitetskontrollerade material</p>
                </li>
                <li>
                    <FaCheckCircle />
                    <p>Precision i varje detalj</p>
                </li>
            </ul>
        </div>

        <button className={styles.continueBtn}>
            <p>GÅ VIDARE TILL KASSAN</p>
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

        <div className={styles.paymentOptionsContainer}>
            <VisaLogoIcon width={42} />
            <MastercardLogoIcon width={42} />
            <img 
                src={KlarnaIcon} 
                alt="Klarna" 
                className={styles.klarnaIcon} 
            />
            <PaypalIcon width={54} />
          </div>
    </div>
  )
}

export default CheckoutComponent
