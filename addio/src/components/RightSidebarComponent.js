import React from 'react'
import styles from "./RightSidebarComponent.module.css"
import MaterialSpecificationComponent from './MaterialSpecificationComponent'
import CheckoutComponent from './CheckoutComponent'
import AdComponent from './AdComponent'

const RightSidebarComponent = () => {
  return (
    <div className={styles.rightSidebarContainer}>
        <AdComponent />
        <CheckoutComponent />
    </div>
  )
}

export default RightSidebarComponent
