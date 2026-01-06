import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ConfigureComponent.module.css";
import logo from "../assets/Logo.png";
import STLViewerComponent from "./STLViewerComponent";

const materialsFromDB = [
  { id: "pla", name: "PLA" },
  { id: "abs", name: "ABS" },
  { id: "petg", name: "PETG" },
  { id: "nylon", name: "Nylon" },
  { id: "carbon", name: "Carbon Fiber" },
];

const infilltypes = [
  { id: "30%", name: "30%" },
  { id: "25%", name: "25%" },
  { id: "10%", name: "10%" },
  { id: "5%", name: "5%" },
];

const colors = [
  { id: "red", name: "Röd" },
  { id: "blue", name: "Blå" },
  { id: "green", name: "Grön" },
  { id: "black", name: "Svart" },
  { id: "white", name: "Vit" },
];

const ConfigureComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const downloadUrl =
    location.state?.downloadUrl || sessionStorage.getItem("cadDownloadUrl") || "";
  const originalName =
    location.state?.originalName || sessionStorage.getItem("cadOriginalName") || "modell.stl";

  const [quantity, setQuantity] = useState(1);
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [infill, setInfill] = useState("");

  const materialName = useMemo(
    () => materialsFromDB.find((m) => m.id === material)?.name || "",
    [material]
  );
  const colorName = useMemo(() => colors.find((c) => c.id === color)?.name || "", [color]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Offert skickad!\nKvantitet: ${quantity}\nMaterial: ${materialName}\nFärg: ${colorName}\nInfill: ${infill}`
    );
  };

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <img src={logo} alt="Brand IT 3D" className={styles.sidebarLogo} />
      </aside>

      <main className={styles.content}>
        <div className={styles.headerRow}>
          <h1 className={styles.pageTitle}>Konfigurera din offert</h1>
          <div className={styles.subTitle}>
            Fil: <strong>{originalName}</strong>
          </div>
        </div>

        <div className={styles.grid}>
          <section className={styles.left}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Inställningar</h2>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label className={styles.label}>Kvantitet</label>
                  <input
                    className={`${styles.input} ${styles.quantityInput}`}
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Material</label>
                  <select
                    className={styles.select}
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                  >
                    <option value="">-- Välj material --</option>
                    {materialsFromDB.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ✅ Färg som SELECT – över Infill */}
                <div className={styles.field}>
                  <label className={styles.label}>Färg</label>
                  <select
                    className={styles.select}
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  >
                    <option value="">-- Välj färg --</option>
                    {colors.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ✅ Infill som kort */}
                <div className={styles.field}>
                  <div className={styles.fieldHeader}>
                    <div className={styles.label}>Infill</div>
                    <div className={styles.valueHint}>{infill || "Välj infill"}</div>
                  </div>

                  <div className={styles.optionList}>
                    {infilltypes.map((inf) => (
                      <button
                        key={inf.id}
                        type="button"
                        className={`${styles.optionCard} ${
                          infill === inf.id ? styles.optionCardActive : ""
                        }`}
                        onClick={() => setInfill(inf.id)}
                      >
                        <div className={styles.optionMain}>{inf.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={!material || !color || !infill || !downloadUrl}
                >
                  Få offert
                </button>

                {!downloadUrl && (
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => navigate("/")}
                  >
                    Tillbaka och ladda upp
                  </button>
                )}
              </form>
            </div>
          </section>

          <section className={styles.right}>
            <div className={styles.viewerCard}>
              <div className={styles.viewerTitle}>Förhandsgranskning</div>

              {downloadUrl ? (
                <STLViewerComponent url={downloadUrl} fileName={originalName} locked={true} showBadge={true} />
              ) : (
                <div className={styles.missingFile}>Ingen STL hittades.</div>
              )}

              <div className={styles.viewerHint}>Dra för att rotera. Scrolla för zoom.</div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ConfigureComponent;
