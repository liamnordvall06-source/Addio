import React, { useEffect, useMemo, useState } from "react";
import styles from "./ConfigureComponent.module.css";

const API_BASE = "https://api-iinmezl24q-uc.a.run.app";

const ConfigureComponent = () => {
  const [materials, setMaterials] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(true);
  const [materialsError, setMaterialsError] = useState("");

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedInfill, setSelectedInfill] = useState("");

  const [quote, setQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  const [creatingCheckout, setCreatingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // -----------------------------
  // Load materials
  // -----------------------------
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setMaterialsLoading(true);
        setMaterialsError("");

        const response = await fetch(`${API_BASE}/materials`);
        const data = await response.json();

        if (!response.ok) {
          setMaterialsError(data?.error || "Kunde inte hämta material.");
          return;
        }

        setMaterials(Array.isArray(data.materials) ? data.materials : []);
      } catch (err) {
        console.error(err);
        setMaterialsError("Något gick fel vid hämtning av material.");
      } finally {
        setMaterialsLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const selectedMaterialObj = useMemo(() => {
    return (
      materials.find((m) => String(m.id) === String(selectedMaterial)) || null
    );
  }, [materials, selectedMaterial]);

  // Reset dependent selections when material changes
  useEffect(() => {
    setSelectedColor("");
    setSelectedInfill("");
    setQuote(null);
    setQuoteError("");
    setCheckoutError("");
  }, [selectedMaterial]);

  // NOTE: infill could be "0" -> truthy check must be explicit
  const isFormValid =
    Number(selectedQuantity) > 0 &&
    Boolean(selectedMaterial) &&
    Boolean(selectedColor) &&
    selectedInfill !== "" &&
    Number(selectedInfill) >= 0;

  // -----------------------------
  // Create quote
  // -----------------------------
  const fetchQoute = async () => {
    const filePath = sessionStorage.getItem("uploadedFilePath");

    if (!filePath) {
      setQuoteError("Ingen fil hittades. Ladda upp en STL först.");
      return null;
    }

    const qty = Number(selectedQuantity);
    const inf = Number(selectedInfill);

    const qouteData = {
      quantity: qty,
      materialId: String(selectedMaterial),
      color: String(selectedColor),
      infill: inf,
      fileId: filePath, // storage path e.g. uploads/xxxx.stl
    };

    try {
      setLoadingQuote(true);
      setQuoteError("");
      setCheckoutError("");
      setQuote(null);

      const response = await fetch(`${API_BASE}/getQoute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(qouteData),
      });

      const data = await response.json();

      if (!response.ok) {
        setQuoteError(data?.error || "Kunde inte hämta offert.");
        return null;
      }

      // Backend MUST return quoteId
      if (!data?.quoteId) {
        setQuoteError(
          "Offerten saknar quoteId från backend. Lägg till quoteId i /getQoute-responsen."
        );
        return null;
      }

      setQuote(data);
      return data;
    } catch (err) {
      console.error(err);
      setQuoteError("Något gick fel. Försök igen.");
      return null;
    } finally {
      setLoadingQuote(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    await fetchQoute();
  };

  // -----------------------------
  // Create Checkout Session + redirect
  // -----------------------------
  const goToCheckout = async () => {
    try {
      setCreatingCheckout(true);
      setCheckoutError("");

      const quoteId = quote?.quoteId;
      if (!quoteId) {
        setCheckoutError("Saknar quoteId. Klicka på 'Få offert' igen.");
        return;
      }

      const response = await fetch(`${API_BASE}/createPaymentLink`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCheckoutError(data?.error || "Kunde inte skapa betalningslänk.");
        return;
      }

      if (!data?.url) {
        setCheckoutError("Svar saknar URL från backend.");
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setCheckoutError("Något gick fel när betalningen skulle skapas.");
    } finally {
      setCreatingCheckout(false);
    }
  };

  const checkoutDisabled =
    creatingCheckout || loadingQuote || !quote?.success || !quote?.quoteId;

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
            <option key={m.id} value={String(m.id)}>
              {m.name}
            </option>
          ))}
        </select>

        <label>Färg</label>
        <select
          className={styles.configureInput}
          disabled={!selectedMaterialObj}
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          required
        >
          <option value="">Välj färg</option>
          {Object.entries(selectedMaterialObj?.colors || {}).map(
            ([name, hex]) => (
              <option key={name} value={hex}>
                {name}
              </option>
            )
          )}
        </select>

        <label>Infill</label>
        <select
          className={styles.configureInput}
          disabled={!selectedMaterialObj}
          value={selectedInfill}
          onChange={(e) => setSelectedInfill(e.target.value)}
          required
        >
          <option value="">Välj infill</option>
          {(selectedMaterialObj?.infill || []).map((value, index) => (
            <option key={index} value={value}>
              {value} %
            </option>
          ))}
        </select>

        <label className={styles.finishText}>Slutför</label>
        <p className={styles.checkoutText}>
          Vill du gå till kassan och betala eller lägga till fler filer i din
          offert?
        </p>

        <div className={styles.buttonContainer}>
          <button
            type="submit"
            className={styles.checkoutBtn}
            disabled={!isFormValid || loadingQuote || creatingCheckout}
          >
            {loadingQuote ? "Beräknar…" : "Få offert"}
          </button>
        </div>

        {/* Quote errors */}
        {quoteError && <div className={styles.quoteError}>{quoteError}</div>}

        {/* Checkout errors */}
        {checkoutError && (
          <div className={styles.quoteError}>{checkoutError}</div>
        )}

        {/* Quote UI */}
        {quote?.success && (
          <div className={styles.quoteCard}>
            <div className={styles.quoteHeader}>
              <div>
                <div className={styles.quoteTitle}>Din offert #{quote.input.fileId}</div>
              </div>
            </div>

            <div className={styles.quoteGrid}>
              <div className={styles.quoteRow}>
                <span>Startavgift: </span>
                <span>{quote.pricing?.setupFee} kr</span>
              </div>
              <div className={styles.quoteRow}>
                <span>Styckpris: </span>
                <span>{quote.pricing?.unitPrice} kr</span>
              </div>
              <div className={styles.quantity}>
                <span>Antal: </span>
                {Number(quote.input?.quantity).toFixed(0)} st
              </div>
              <div className={styles.quoteTotal}>
                <span>Total: </span>
                {Number(quote.pricing?.total ?? 0).toFixed(2)} kr
              </div>
            </div>

            <div className={styles.quoteDivider} />

            <div className={styles.quoteFooter}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={goToCheckout}
                disabled={checkoutDisabled}
              >
                {creatingCheckout ? "Skapar betalning…" : "Beställ"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ConfigureComponent;
