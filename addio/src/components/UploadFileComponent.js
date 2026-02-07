import React, { useState } from "react";
import styles from "./UploadFileComponent.module.css";


const UploadFileComponent = () => {

    const [file, setFile] = useState(null);
    const [fileId, setFileId] = useState("");
    const [fileExt, setFileExt] = useState("");
    const [loading, setLoading] = useState(false);
    

}


export default UploadFileComponent;