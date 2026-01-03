import React, { useCallback, useMemo, useRef, useState } from "react";
import styles from "./uploadCADComponent.module.css";
import { initializeApp, getApps } from "firebase/app";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyBsoDgD5yX-pZeGeBImXr8m7Dki-HYOWZE",
  authDomain: "addio-11148.firebaseapp.com",
  projectId: "addio-11148",
  storageBucket: "addio-11148.firebasestorage.app",
  messagingSenderId: "925798005766",
  appId: "1:925798005766:web:86d9c69eddc7bc9f745787",
  measurementId: "G-VMHGS6YK6Y"
};

function ensureFirebase() {
  if (!getApps().length) initializeApp(firebaseConfig);
}

const ALLOW_OBJ = true;
const allowedExt = new Set(ALLOW_OBJ ? ["stl", "obj"] : ["stl"]);

function getExt(name = "") {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

const UploadCADComponent = () => {
  const inputRef = useRef(null);
  const uploadTaskRef = useRef(null);
  const dragDepthRef = useRef(0);

  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [meta, setMeta] = useState(null);

  const acceptAttr = useMemo(() => (ALLOW_OBJ ? ".stl,.obj" : ".stl"), []);

  const resetStatus = useCallback(() => {
    setError("");
    setSuccess(false);
    setProgress(0);
    setMeta(null);
  }, []);

  const validate = useCallback((file) => {
    if (!file) return false;

    const ext = getExt(file.name);
    if (!allowedExt.has(ext)) {
      setError(ALLOW_OBJ ? "Stöder just nu bara .stl och .obj." : "Stöder just nu bara .stl.");
      return false;
    }
    return true;
  }, []);

  const abortUpload = useCallback(() => {
    try {
      uploadTaskRef.current?.cancel();
    } catch (_) {}
  }, []);

  const uploadToStorage = useCallback(async (file) => {
    ensureFirebase();
    const storage = getStorage();

    // Create a server-friendly ID and path
    const fileId = uuidv4();
    const ext = getExt(file.name);
    const objectPath = `quotation_files/${fileId}.${ext}`;

    const objRef = storageRef(storage, objectPath);

    // Optional: include metadata
    const metadata = {
      contentType: file.type || (ext === "stl" ? "model/stl" : "text/plain"),
      customMetadata: {
        originalName: file.name,
        fileId,
      },
    };

    return new Promise((resolve, reject) => {
      const task = uploadBytesResumable(objRef, file, metadata);
      uploadTaskRef.current = task;

      setUploading(true);
      setProgress(0);

      task.on(
        "state_changed",
        (snap) => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          setProgress(pct);
        },
        (err) => {
          setUploading(false);
          uploadTaskRef.current = null;

          // Firebase Storage errors have codes like "storage/unauthorized"
          if (err?.code === "storage/canceled") return reject(new Error("Uppladdningen avbröts."));
          if (err?.code === "storage/unauthorized") {
            return reject(new Error("Otillåten uppladdning (Storage rules)."));
          }
          reject(new Error(err?.message || "Något gick fel vid uppladdning."));
        },
        () => {
          setUploading(false);
          uploadTaskRef.current = null;

          resolve({
            fileId,
            path: objectPath,
            originalName: file.name,
            size: file.size,
            ext,
          });
        }
      );
    });
  }, []);

  const handleFile = useCallback(
    async (file) => {
      if (uploading) return;

      resetStatus();
      if (!validate(file)) return;

      try {
        const uploaded = await uploadToStorage(file);
        setMeta(uploaded);
        setSuccess(true);

        // Optional: call your API to “finalize” / create a quotation doc in Firestore
        // await fetch("https://.../api/quotation_finalize", { method:"POST", headers:{...}, body: JSON.stringify(uploaded) });

      } catch (e) {
        setError(e?.message || "Något gick fel vid uppladdning.");
      }
    },
    [uploading, resetStatus, validate, uploadToStorage]
  );

  const onBrowse = useCallback(() => {
    if (uploading) return;
    inputRef.current?.click();
  }, [uploading]);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragDepthRef.current = 0;
      setDragOver(false);

      const files = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : [];
      if (!files.length) return;

      if (files.length > 1) {
        setError("Välj bara en fil åt gången.");
        setSuccess(false);
        return;
      }

      handleFile(files[0]);
    },
    [handleFile]
  );

  const onDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current += 1;
    setDragOver(true);
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current -= 1;
    if (dragDepthRef.current <= 0) {
      dragDepthRef.current = 0;
      setDragOver(false);
    }
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.innerContainer}>
        <h1>Ladda upp CAD-modellen och få en offert</h1>

        <div
          className={`${styles.dropzone} ${dragOver ? styles.dragOver : ""}`}
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={onBrowse}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onBrowse();
            }
          }}
          role="button"
          tabIndex={0}
          aria-disabled={uploading}
        >
          <input
            ref={inputRef}
            type="file"
            accept={acceptAttr}
            className={styles.hiddenInput}
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              handleFile(file);
              e.target.value = "";
            }}
          />

          <div className={styles.content}>
            <div className={styles.icon}>↑</div>

            <p className={styles.text}>
              Drag and drop here or <span className={styles.link}>select</span>
            </p>
            <p className={styles.supported}>Stöder: {ALLOW_OBJ ? ".stl, .obj" : ".stl"}</p>

            {uploading && (
              <div style={{ width: "100%", marginTop: 12 }}>
                <p className={styles.text}>Laddar upp… {progress}%</p>

                <div
                  style={{
                    height: 8,
                    width: "100%",
                    background: "rgba(0,0,0,0.1)",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progress}%`,
                      background: "rgba(0,0,0,0.35)",
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    abortUpload();
                  }}
                  style={{ marginTop: 10 }}
                >
                  Avbryt
                </button>
              </div>
            )}

            {success && (
              <p className={styles.text}>
                ✔ Fil mottagen {meta?.fileId ? `(ID: ${meta.fileId})` : ""}
              </p>
            )}

            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCADComponent;
