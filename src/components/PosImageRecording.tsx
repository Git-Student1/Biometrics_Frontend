import { useState } from "react";
import { CameraInteraction } from "./CameraInteraction.tsx";
import { PosImageRecordingControls } from "./PosImageRecordingControls.tsx";

export function PosImageRecording() {
    const [message, setMessage] = useState("");

    return (
        <CameraInteraction message={message} setMessage={setMessage}>
            <PosImageRecordingControls/>
            <p>{message}</p>
        </CameraInteraction>
    );
}