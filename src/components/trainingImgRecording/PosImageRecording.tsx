import { useState } from "react";
import { CameraInteraction } from "../commons/CameraInteraction.tsx";
import { PosImageRecordingControls } from "./PosImageRecordingControls.tsx";
import styles from "../../Styles/Styles.module.css";


export function PosImageRecording() {
    const [message, setMessage] = useState("");

    return (
        <CameraInteraction message={message} setMessage={setMessage}>

            <PosImageRecordingControls/>
            <p className={`${styles.text} ${styles.error}`}>{message}</p>
        </CameraInteraction>
    );
}