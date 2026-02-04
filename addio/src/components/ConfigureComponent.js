import React, { useEffect, useMemo, useState } from "react";
import styles from "./ConfigureComponent.module.css";


const ConfigureComponent = () => {
  const [materials, setMaterials] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(true);
  const [materialsError, setMaterialsError] = useState("");

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedInfill, setSelectedInfill] = useState("");




  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setMaterialsLoading(true);
        setMaterialsError("");

        const response = await fetch(`https://api-iinmezl24q-uc.a.run.app/material`);
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          setMaterialsError(data?.error || "Kunde inte hämta material.");
          return;
        }

        setMaterials(data);
      } catch (err) {
        console.error(err);
        setMaterialsError("Något gick fel vid hämtning av material.");
      } finally {
        setMaterialsLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const fetchQoute = async () => {
    const fileId = sessionStorage.getItem("fileId");

    if (!fileId) {
      throw new Error("No fileId in sessionStorage");
    }

    const jsonObj = {
      fileId,
      quantity: selectedQuantity,
      materialId: selectedMaterial,
      infill: selectedInfill,
    };

    const response = await fetch("https://api-iinmezl24q-uc.a.run.app/qoute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonObj),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchQoute();
  };


  return (
    <div className={styles.mainContainer}>
      <form className={styles.innerContainer} onSubmit={handleSubmit}>
        <h1>Specifikationer</h1>

        {/* Materials status */}
        {materialsLoading && (
          <div className={styles.infoBox}>Hämtar material…</div>
        )}
        {materialsError && (
          <div className={styles.errorBox}>{materialsError}</div>
        )}

        <label>Kvantitet</label>
        <input
          type="number"
          min="1"
          className={styles.configureInput}
          value={selectedQuantity}
          onChange={(e) => setSelectedQuantity(e.target.value)}
          required
        />

        <label>Material</label>
        <select
          className={styles.configureInput}
          value={selectedMaterial}
          onChange={(e) => setSelectedMaterial(e.target.value)}
          required
          disabled={materialsLoading || !!materialsError}
        >
          <option value="">Välj material</option>
          {materials.map((m) => (
            <option key={m.filament_id} value={String(m.filament_id)}>
              {m.filament_name}
            </option>
          ))}
        </select>

        <label>Infill</label>
        <input
          type="number"
          className={styles.configureInput}
          value={selectedInfill}
          onChange={(e) => setSelectedInfill(e.target.value)}
          required
        ></input>

        <label className={styles.finishText}>Slutför</label>
        <p className={styles.checkoutText}>
          Vill du gå till kassan och betala eller lägga till fler filer i din
          offert?
        </p>

        <div className={styles.buttonContainer}>
          <button
            type="submit"
            className={styles.checkoutBtn}
          >
            Få offert
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfigureComponent;
