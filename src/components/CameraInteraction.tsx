import axios from "axios";
import {
    useCallback,
    useEffect,
    useState,
} from "react";


import { getCameraStreamUrl, doIdentification, doVerification } from "../api/modelApi"
import type { VerIdentResponse } from "../api/modelApi";

export function CameraInteraction() {

    const [message, setMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPrepared, setIsPrepared] = useState(false);
    const [preparationError, setPreparationError] =
        useState<string | null>(null);

    const handleKey = useCallback(async (key: string) => {
        setIsProcessing(true);
        setMessage("");
        console.log(`Button ${key} pressed`)
        try {
            let result: string;
            let details: string;

            if(key === "v"){
                ({ result, details } = await doVerification());
            }
            else if (key === "i"){
                ({ result, details } = await doIdentification());
            }

            setMessage(`result: ${result} \n details: ${details}`);
            console.log(`Button ${key} pressed`)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const detail = error.response?.data?.detail;

                setMessage(
                    typeof detail === "string"
                        ? detail
                        : error.message,
                );
            } else {
                setMessage("Camera action failed");
            }
        } finally {
            setIsProcessing(false);
        }
    }, []);

    return (
        <section>
            <img
                src={getCameraStreamUrl()}
                alt="Live camera"
                width={250}
                height={250}
                style={{
                    display: "block",
                    objectFit: "cover",
                    marginBottom: 16,
                }}
                onLoad={() => {
                    console.log("Camera stream loaded");
                }}
                onError={(event) => {
                    console.error(
                        "Camera stream failed:",
                        getCameraStreamUrl(),
                        event,
                    );
                    setMessage("Camera stream could not be loaded");
                }}
            />

            <div style={{ display: "flex", gap: 8 }}>
                <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => void handleKey("i")}
                >
                    Identification
                </button>

                <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => void handleKey("v")}
                >
                    Verification
                </button>

                <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => void handleKey("q")}
                >
                    Close
                </button>
            </div>

            {message && <p>{message}</p>}
        </section>
    );
}