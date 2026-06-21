import React from 'react'
import styles from "./RightSidebarComponent.module.css"
import MaterialSpecificationComponent from './MaterialSpecificationComponent'
import CheckoutComponent from './CheckoutComponent'

const RightSidebarComponent = () => {
  return (
    <div className={styles.rightSidebarContainer}>
        <MaterialSpecificationComponent />
        <CheckoutComponent />
    </div>
  )
}

export default RightSidebarComponent
