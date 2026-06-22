import React, { useState } from 'react'
import styles from "./HelpSupportComponent.module.css"
import { IoChatbubble, IoClose } from "react-icons/io5";
import { MdHelp } from "react-icons/md";
import { MdInfoOutline } from "react-icons/md";
import { IoHelpCircleOutline } from "react-icons/io5";
import { IoCallOutline } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa6";

const HelpSupportComponent = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState(null)

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className={styles.helpSupportContainer}>
      {isOpen && (
        <div className={styles.helpPanel}>
          <div className={styles.panelHeader}>
            <h3>HJÄLP & SUPPORT</h3>
            <button 
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Stäng hjälp"
            >
              <IoClose />
            </button>
          </div>
          
          <div className={styles.panelContent}>
            <div className={styles.menuSection}>
              <button 
                className={styles.menuItem}
                onClick={() => toggleSection('guide')}
              >
                <div className={styles.menuIcon}>
                  <MdInfoOutline />
                </div>
                <span>Materialguide</span>
                <FaArrowRight className={styles.arrow} />
              </button>

              <button 
                className={styles.menuItem}
                onClick={() => toggleSection('faq')}
              >
                <div className={styles.menuIcon}>
                  <IoHelpCircleOutline />
                </div>
                <span>Vanliga frågor</span>
                <FaArrowRight className={styles.arrow} />
              </button>

              <button 
                className={styles.menuItem}
                onClick={() => toggleSection('contact')}
              >
                <div className={styles.menuIcon}>
                  <IoCallOutline />
                </div>
                <span>Kontakta oss</span>
                <FaArrowRight className={styles.arrow} />
              </button>
            </div>

            {expandedSection === 'guide' && (
              <div className={styles.expandedContent}>
                <h4>Materialguide</h4>
                <p>Utforska vår kompletta guide för att lära dig mer om olika material, deras egenskaper och användningsområden.</p>
                <a href="#" className={styles.link}>Läs full guide</a>
              </div>
            )}

            {expandedSection === 'faq' && (
              <div className={styles.expandedContent}>
                <h4>Vanliga frågor</h4>
                <ul>
                  <li>Hur laddar jag upp en fil?</li>
                  <li>Vilka format stöds?</li>
                  <li>Hur länge tar leveransen?</li>
                  <li>Kan jag spara offerten?</li>
                </ul>
              </div>
            )}

            {expandedSection === 'contact' && (
              <div className={styles.expandedContent}>
                <h4>Kontakta oss</h4>
                <p>Email: <a href="mailto:support@addio.se">support@addio.se</a></p>
                <p>Vi svarar normalt inom 24 timmar.</p>
              </div>
            )}

            <div className={styles.materialCompareSection}>
              <MdInfoOutline />
              <div>
                <p className={styles.materialCompareText}>Osäker på materialet?</p>
                <a href="#" className={styles.compareLink}>Jämför material i vår guide <FaArrowRight /></a>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        className={styles.helpBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Öppna hjälp"
        title="Hjälp och support"
      >
        <IoChatbubble />
      </button>
    </div>
  )
}

export default HelpSupportComponent
