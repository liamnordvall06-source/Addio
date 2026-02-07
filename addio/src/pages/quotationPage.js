import React, { useState, useEffect } from "react";
import styles from "./quotationPage.module.css";
import HeaderComponent from "../components/headerComponent";
import { storage } from "../middleware/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { PuffLoader, ClipLoader } from "react-spinners";
import ModelPreview from "../components/ModelPreview";
import { MdDeleteOutline } from "react-icons/md";

// Save information in session to reload
// Make success page
// Make red text on cancel payment
// Update env variables for new directive March
// Structure the code into components

const QuotationPage = () => {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingQuote, setLoadingQuote] = useState(false);
    const [fileId, setFileId] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [fileExt, setFileExt] = useState("");
    const [materials, setMaterials] = useState();

    const [quantity, setQuantity] = useState(1);
    const [materialId, setMaterialId] = useState("");
    const [infill, setInfill] = useState(25);

    const [quote, setQuote] = useState({partPrice: 0, quantity: 0, startPrice: 0, totalPrice: 0, shippingCost: 0});

    useEffect(() => {
        const fetchMaterial = async () => {
            try {
                const response = await fetch("https://api-iinmezl24q-uc.a.run.app/material");

                const data = await response.json();

                setMaterials(data);

                setMaterialId(data[1].filament_id);
            } catch (e) {
                console.error(e.message);
            }
        }

        fetchMaterial();
    }, [])

    const uploadHandler = async () => {
        if (!file) return;
        try {
            setLoading(true);
            const rawExt = (file.name.split(".").pop() || "").toLowerCase();
            const allowed = new Set(["stl", "step", "stp", "3mf", "obj"]);
            const ext = allowed.has(rawExt) ? rawExt : "stl";

            const newFileName = `${uuidv4()}.${ext}`;
            const storagePath = `uploads/${newFileName}`; 

            const storageRef = ref(storage, storagePath);
            await uploadBytes(storageRef, file, {
            contentType: file.type || "application/octet-stream",
            });

            const downloadUrl = await getDownloadURL(storageRef);
            setPreviewUrl(downloadUrl);
            setFileExt(ext);

            const response = await fetch("https://api-iinmezl24q-uc.a.run.app/file", {
            method: "POST",
            headers: {
                "X-Storage-Path": storagePath,  
                "X-File-Name": newFileName,      
            },
            });

            if (!response.ok) {
            const text = await response.text().catch(() => "");
            throw new Error(`Request failed: ${response.status} - ${text}`);
            }

            const data = await response.json();
            sessionStorage.setItem("fileId", data.file_id);
            setFileId(data.file_id);
            setLoading(false);
        } catch (err) {
            console.error("Upload failed:", err);
            setLoading(false);
        }
    };

    const handleFileChange = (selectedFile) => {
        if (!selectedFile) {
            setFile(null);
            return;
        }

        setFile(selectedFile);

        const reader = new FileReader();   

        reader.readAsText(selectedFile);
    };

    useEffect(() => {
        uploadHandler();
    }, [file])

    const handleDelete = () => {
        setFile(0);
        setFileId(0);
        setQuote({partPrice: 0, quantity: 0, startPrice: 0});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchQoute();
    }

    const fetchQoute = async () => {
        if (!fileId || !materialId) return;

        try {
        setLoadingQuote(true);
        const jsonObj = {
            fileId,
            quantity: quantity,
            materialId: materialId,
            infill: infill,
        };

        const response = await fetch("https://api-iinmezl24q-uc.a.run.app/qoute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonObj),
        });

        if (!response.ok) {
            const text = await response.text().catch(() => "");
            throw new Error(`Request failed: ${response.status} - ${text}`);
        }

        const data = await response.json();
        setQuote(data);
        setLoadingQuote(false);
    }
    catch (e) {
        console.log(e)
        setLoadingQuote(false);
    }
    };

    useEffect(() => {
        if (!fileId || !materialId) return;

        fetchQoute();
    }, [fileId]);

    const handleCheckout = async () => {
        try {
            const response = await fetch(
            "https://api-iinmezl24q-uc.a.run.app/createPaymentLink",
            {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "X-Quote-Id": quote.quoteId, 
                },
            }
            );

            if (!response.ok) {
            throw new Error("Payment link creation failed");
            }

            const data = await response.json();

            window.location.href = data.url;
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={styles.mainContainer}>

            <HeaderComponent />

            <div className={styles.innerContainer}>
                <div className={styles.configureContainer}>
                    <h1>Få en 3D-printing offert</h1>
                    <div className={styles.uploadFileContainer}>
                        {!loading ? (
                        <>
                            <label className={styles.uploadBtn}>
                                <input
                                type="file"
                                hidden
                                accept=".stl, .obj, .step"
                                onChange={(e) =>
                                    handleFileChange(e.target.files?.[0] || null)
                                }
                                />
                                <p>
                                Ladda upp 3D-fil
                                </p>
                            </label>

                            <p className={styles.supportedText}>
                            File types: STL, STP, STEP, OBJ, 3MF. Wall thickness &gt; 1.2mm,
                            Thinnest part ≥ 0.8mm. Upload Instructions
                            </p>

                            <p className={styles.safteyText}>
                            All uploads are secure and confidential.
                            </p>
                        </>
                        ) : 
                            <>
                                <PuffLoader color="#4294FF" />
                                <p>Uploading file...</p>
                            </>
                        }
                    </div>
                    <div className={styles.forbiddenContainer}>
                        <p>Uploading weapons or parts containing export-controlled items which violates our terms of use will result in account disabled.</p>
                    </div>
                        {fileId ? (
                            <div className={styles.settingsContainer}>

                            <div className={styles.modelInformation}>
                                    <div className={styles.previewContainer}>
                                        {previewUrl ? (
                                            <ModelPreview url={previewUrl} ext={fileExt} />
                                        ) : (
                                            <p><PuffLoader color="#4294FF" /></p>
                                        )}
                                    </div>
                                    <div className={styles.modelSpecification}>
                                        <p><b>{file.name}</b></p>
                                        <div>
                                            <p>22x25x10 mm</p>
                                            <p>5500 mm³</p>
                                        </div>
                                    </div>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete()}><MdDeleteOutline /></button>
                            </div>           
                                
                            <form onSubmit={handleSubmit} className={styles.configurationForm}>
                                <label>Antal:</label>
                                <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)}></input>

                                <label>Material:</label>
                                <div className={styles.materialsContainer}>
                                {materials?.map(material => {
                                    const isActive = materialId === material.filament_id;

                                    return (
                                    <button
                                        type="button"
                                        key={material.filament_id}
                                        onClick={() => setMaterialId(material.filament_id)}
                                        className={`${styles.materialBtn} ${isActive ? styles.active : ""}`}
                                    >
                                        {material.filament_name}
                                    </button>
                                    );
                                })}
                                </div>

                                <label>Infill:</label>
                                <input type="number" min="10" value={infill} onChange={(e) => setInfill(e.target.value)}></input> 

                                <div className={styles.partPriceContainer}>
                                    <label>Pris:</label>
                                    {loadingQuote ? <ClipLoader size={20} color="#4294FF" /> : <p><b>{quote?.partPrice * quote?.quantity + quote?.startPrice + " kr"}</b></p>}
                                    <button type="submit" className={styles.updateBtn}>Uppdatera</button>
                                </div>

                            </form>


                            </div>
                        ) : null}
                </div>
                <div className={styles.priceContainer}>
                    <div className={styles.btnContainer}>
                        <h2>Prisdetaljer</h2>
                        <div className={styles.totalPriceContainer}>
                            <div className={styles.priceRow}>
                                <h3>Totalt pris</h3>
                                {loadingQuote ? (
                                <ClipLoader size={20} color="#4294FF" />
                                ) : (
                                <span className={styles.priceValue}>
                                    {quote?.totalPrice} kr
                                </span>
                                )}
                            </div>
                            </div>

                            <div className={styles.priceSpecificationContainer}>
                            <h3>Specifikation</h3>

                            <div className={styles.priceRow}>
                                <span>Delpris</span>
                                {loadingQuote ? (
                                <ClipLoader size={16} color="#4294FF" />
                                ) : (
                                <span className={styles.priceValue}>
                                    {quote?.partPrice * quote?.quantity + quote?.startPrice} kr
                                </span>
                                )}
                            </div>

                            <div className={styles.priceRow}>
                                <span>Fraktkostnad</span>
                                {loadingQuote ? (
                                <ClipLoader size={16} color="#4294FF" />
                                ) : (
                                <span className={styles.priceValue}>
                                    {quote?.shippingCost} kr
                                </span>
                                )}
                            </div>
                            <div className={styles.priceRow}>
                                <span>Antal</span>
                                {loadingQuote ? (
                                <ClipLoader size={16} color="#4294FF" />
                                ) : (
                                <span className={styles.priceValue}>
                                    {quote?.quantity} st
                                </span>
                                )}
                            </div>
                            </div>
                        <button className={styles.checkoutBtn} onClick={() => handleCheckout()}>GÅ TILL KASSA</button>
                    </div>
                </div>
            </div>
            {/* <div className={styles.footer}></div> */}
        </div>
    );
}


export default QuotationPage;