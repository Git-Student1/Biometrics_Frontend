import axios from "axios";
import {
    useCallback,
    useEffect,
    useState,
} from "react";

type Props = {
    preparation: () => Promise<void>;
};

import { getCameraStreamUrl } from "../api/modelApi"

export function CameraInteraction({
                                      preparation,
                                  }: Props) {
    const [message, setMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPrepared, setIsPrepared] = useState(false);
    const [preparationError, setPreparationError] =
        useState<string | null>(null);

    const handleKey = useCallback(async (key: string) => {
        setIsProcessing(true);
        setMessage("");

        try {
            const result = await pressCameraKey(key);
            setMessage(`Executed: ${result.key}`);
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

    useEffect(() => {
        let cancelled = false;

        async function prepareCamera() {
            setIsPrepared(false);
            setPreparationError(null);

            try {
                await preparation();

                if (!cancelled) {
                    setIsPrepared(true);
                }
            } catch (error) {
                if (cancelled) {
                    return;
                }

                if (axios.isAxiosError(error)) {
                    const detail = error.response?.data?.detail;

                    setPreparationError(
                        typeof detail === "string"
                            ? detail
                            : error.message,
                    );
                } else {
                    setPreparationError(
                        "Camera preparation failed",
                    );
                }
            }
        }

        void prepareCamera();

        return () => {
            cancelled = true;
        };
    }, [preparation]);

    useEffect(() => {
        if (!isPrepared) {
            return;
        }

        function handleKeyDown(event: KeyboardEvent) {
            const target = event.target as HTMLElement;
            const key = event.key.toLowerCase();

            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT"
            ) {
                return;
            }

            if (key === "i" || key === "v" || key === "q") {
                void handleKey(key);
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [handleKey, isPrepared]);

    if (preparationError) {
        return (
            <section>
                <p>{preparationError}</p>
            </section>
        );
    }

    if (!isPrepared) {
        return (
            <section>
                <p>Preparing camera...</p>
            </section>
        );
    }

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