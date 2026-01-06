import React from "react";
import styles from "./LoadingComponent.module.css";

const LoadingComponent = ({ text = "Laddar Upp Model..." }) => {
  return (
    <div className={styles.wrap}>
      <svg className={styles.svg} viewBox="0 0 360 260" aria-hidden="true">
        <rect x="60" y="70" width="240" height="18" rx="9" className={styles.cap} />
        <rect x="60" y="225" width="240" height="18" rx="9" className={styles.base} />
        <rect x="130" y="190" width="100" height="70" rx="10" className={styles.bed} />
   

        <rect x="168" y="218" width="24" height="0" rx="6" className={styles.print} />

        <g className={styles.gantryZ}>
          <rect x="72" y="145" width="225" height="14" rx="7" className={styles.xBeam} />

          <g className={styles.headX}>
            <rect x="150" y="135" width="60" height="36" rx="12" className={styles.headBody} />
            <rect x="172" y="145" width="16" height="12" rx="6" className={styles.neck} />
            <path d="M180 140 L172 126 L188 126 Z" className={styles.nozzle} />
          </g>
        </g>

     

       

        {/* Z-stolpar längst ner => renderas överst */}
        <rect x="60" y="70" width="18" height="180" rx="9" className={styles.pillar} />
        <rect x="282" y="70" width="18" height="180" rx="9" className={styles.pillar} />
      </svg>

      <div className={styles.text}>{text}</div>
    </div>
  );
};

export default LoadingComponent;
<path
  d="M180 140 L172 126 L188 126 Z"
  className={styles.nozzle}
  transform="translate(0, 6)"
/>
