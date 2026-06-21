import React, { useState } from 'react'
import styles from "./FilesListComponent.module.css";
import { IoEye } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { MdAdd, MdRemove } from "react-icons/md";

const FilesListComponent = () => {
  const [selectedFileId, setSelectedFileId] = useState(null)
  const [files, setFiles] = useState([
    {
      id: 1,
      name: 'faste_bak.stl',
      dimensions: '120 × 80 × 65 mm',
      volume: '52.3 cm³',
      weight: '61.2 g',
      quantity: 1,
      material: 'PA6-CF',
      price: '248 kr'
    },
    {
      id: 2,
      name: 'konsol_v2.stl',
      dimensions: '90 × 45 × 50 mm',
      volume: '28.1 cm³',
      weight: '33.0 g',
      quantity: 2,
      material: 'PA6-CF',
      price: '196 kr'
    },
    {
      id: 3,
      name: 'kåpa_v1.stl',
      dimensions: '150 × 120 × 40 mm',
      volume: '72.8 cm³',
      weight: '85.4 g',
      quantity: 1,
      material: 'PA6-CF',
      price: '286 kr'
    },
    {
      id: 4,
      name: 'adapter.stl',
      dimensions: '60 × 60 × 30 mm',
      volume: '18.9 cm³',
      weight: '22.1 g',
      quantity: 4,
      material: 'PA6-CF',
      price: '176 kr'
    }
  ])

  const handleQuantityChange = (id, change) => {
    setFiles(files.map(file => 
      file.id === id ? { ...file, quantity: Math.max(1, file.quantity + change) } : file
    ))
  }

  const handleDelete = (id) => {
    setFiles(files.filter(file => file.id !== id))
    if (selectedFileId === id) {
      setSelectedFileId(null)
    }
  }

  const selectFile = (id) => {
    setSelectedFileId(id)
  }

  const totalParts = files.reduce((sum, file) => sum + file.quantity, 0)
  const totalVolume = files.reduce((sum, file) => {
    const volume = parseFloat(file.volume)
    return sum + (volume * file.quantity)
  }, 0).toFixed(1)

  return (
    <div className={styles.filesListContainer}>
      <div className={styles.headerSection}>
        <div className={styles.titleBar}>
          <h3>UPPLADDADE FILER ({files.length})</h3>
          <div className={styles.filterButtons}>
            <button className={styles.filterBtn}>Radera</button>
            <button className={styles.filterBtn}>Duplicera</button>
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.filesTable}>
          <thead>
            <tr>
              <th className={styles.colFilename}>Filnamn</th>
              <th className={styles.colDimensions}>Mått</th>
              <th className={styles.colVolume}>Volym</th>
              <th className={styles.colWeight}>Vikt</th>
              <th className={styles.colQuantity}>Antal</th>
              <th className={styles.colMaterial}>Material</th>
              <th className={styles.colPrice}>Pris</th>
              <th className={styles.colActions}>Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {files.map(file => (
              <tr
                key={file.id}
                className={selectedFileId === file.id ? styles.selectedRow : ''}
                onClick={() => selectFile(file.id)}
              >
                <td className={styles.colFilename}>
                  <div className={styles.fileNameCell}>
                    <div className={styles.fileThumbnail}></div>
                    <span>{file.name}</span>
                  </div>
                </td>
                <td className={styles.colDimensions}>{file.dimensions}</td>
                <td className={styles.colVolume}>{file.volume}</td>
                <td className={styles.colWeight}>{file.weight}</td>
                <td className={styles.colQuantity}>
                  <div className={styles.quantityControl}>
                    <button onClick={() => handleQuantityChange(file.id, -1)}>−</button>
                    <span>{file.quantity}</span>
                    <button onClick={() => handleQuantityChange(file.id, 1)}>+</button>
                  </div>
                </td>
                <td className={styles.colMaterial}>
                  <span className={styles.materialTag}>{file.material}</span>
                </td>
                <td className={styles.colPrice}>{file.price}</td>
                <td className={styles.colActions}>
                  <button className={styles.actionBtn} title="Visa">
                    <IoEye />
                  </button>
                  <button className={styles.actionBtn} onClick={() => handleDelete(file.id)} title="Radera">
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.footerSection}>
        <div className={styles.buttonGroup}>
          <button className={styles.actionButton}>Lägg till filer</button>
          <button className={styles.actionButton}>Rensa lista</button>
        </div>
        <div className={styles.summary}>
          <span>Totalt antal delar: <strong>{totalParts}</strong></span>
          <span>Beräknad volym: <strong>{totalVolume} cm³</strong></span>
        </div>
      </div>
    </div>
  )
}

export default FilesListComponent;
