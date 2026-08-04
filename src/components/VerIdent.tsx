import { useState } from "react";
import {CameraInteraction} from "./CameraInteraction.tsx";
import {VerIdentControls} from "./VerIdentControls.tsx";

export function VerIdent() {
    const [message, setMessage] = useState("");

    return (
        <CameraInteraction message={message} setMessage={setMessage}>
            <VerIdentControls
                setMessage={setMessage}
            />
        </CameraInteraction>
    );
}