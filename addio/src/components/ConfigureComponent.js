import React, { useState } from "react";
import styles from "./ConfigureComponent.module.css";
import logo from "../assets/Logo.png";
import STLViewerComponent from "./STLViewerComponent";

const materialsFromDB = [
  { id: "pla", name: "PLA" },
  { id: "abs", name: "ABS" },
  { id: "petg", name: "PETG" },
  { id: "nylon", name: "Nylon" },
  { id: "carbon", name: "Carbon Fiber" }
];

const infilltypes = [
  { id: "30%", name: "30%" },
  { id: "25%", name: "25%" },
  { id: "10%", name: "10%" },
  { id: "5%", name: "5%" }
];

const colors = [
  { id: "red", name: "Röd" },
  { id: "blue", name: "Blå" },
  { id: "green", name: "Grön" },
  { id: "black", name: "Svart" },
  { id: "white", name: "Vit" }
];

const ConfigureComponent = () => {
  const [quantity, setQuantity] = useState(1);
  const [material, setMaterial] = useState("");
  const [infill, setInfill] = useState("");
  const [color, setColor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Offert skickad!\nKvantitet: ${quantity}\nMaterial: ${material}\nInfill: ${infill}\nFärg: ${color}`
    );
    console.log({ quantity, material, infill, color });
  };

  return (
    <div className={styles.pageContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <img src={logo} alt="Brand IT 3D Logo" className={styles.logo} />
        <div className={styles.techOptions}>
          <h3>Välj teknik</h3>
          <div className={styles.techCard}>
            <strong>Fused Deposition Modeling</strong>
            <p>FDM (350 x 350 x 350 mm)</p>
          </div>
          <div className={styles.techCardDisabled}>
            <strong>Stereolithography</strong>
            <p>SLA (Coming soon)</p>
          </div>
          <div className={styles.techCardDisabled}>
            <strong>Selective Laser Sintering</strong>
            <p>SLS (Coming soon)</p>
          </div>
        </div>
      </div>

      {/* Right main area */}
      <div className={styles.mainContent}>
        <div className={styles.formAndViewer}>
          <div className={styles.formWrapper}>
            <form className={styles.configureForm} onSubmit={handleSubmit}>
              <h1 className={styles.title}>Ladda upp CAD-modellen och få en offert</h1>

              <div className={styles.formRow}>
                <label>Kvantitet</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>

              <div className={styles.formRow}>
                <label>Material</label>
                <select value={material} onChange={(e) => setMaterial(e.target.value)}>
                  <option value="">-- Välj material --</option>
                  {materialsFromDB.map((mat) => (
                    <option key={mat.id} value={mat.id}>{mat.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formRow}>
                <label>Infill</label>
                <select value={infill} onChange={(e) => setInfill(e.target.value)}>
                  <option value="">-- Välj infill --</option>
                  {infilltypes.map((inf) => (
                    <option key={inf.id} value={inf.id}>{inf.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formRow}>
                <label>Färg</label>
                <select value={color} onChange={(e) => setColor(e.target.value)}>
                  <option value="">-- Välj färg --</option>
                  {colors.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className={styles.submitButton}>
                Få offert
              </button>
            </form>
          </div>

          <div className={styles.stlWrapper}>
            <STLViewerComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigureComponent;
