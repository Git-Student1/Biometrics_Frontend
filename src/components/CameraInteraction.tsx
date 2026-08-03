import axios from "axios";
import {
    useCallback,
    useEffect,
    useState,
} from "react";


import { getCameraStreamUrl, doIdentification, doVerification, fetchPeopleForVerification } from "../api/modelApi"
import type { VerIdentResponse } from "../api/modelApi";

export function CameraInteraction() {

    const [message, setMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const [selectedPersonId, setSelectedPersonId] = useState("");
    const [showPersonSelection, setShowPersonSelection] = useState(false);

    const [people, setPeople] = useState<string[]>([])


    const runIdentification = useCallback(async () => {
        setIsProcessing(true);
        setMessage("");

        try {
            const { result, details } = await doIdentification();
            setMessage(`result: ${result} \n details: ${details}`);
        } catch (error) {
            setMessage(getErrorMessage(error));
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const startVerification = useCallback(async () => {
        const {people} = await fetchPeopleForVerification()
        setPeople(people)

        setMessage("")
        setShowPersonSelection(true);
        }

    )

    const confirmVerification = useCallback( async  () => {
        if (!selectedPersonId) {
            setMessage("Select a person first.");
            return;
        }
        setIsProcessing(true);
        setMessage("");
        try {
            const response = await doVerification(selectedPersonId);
            setMessage(`Result: ${response.result}`);
            setShowPersonSelection(false);
        } catch (error) {
            setMessage(getErrorMessage(error));
        } finally {
            setIsProcessing(false);
        }
    }, [selectedPersonId]);


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
                    onClick={runIdentification}
                >
                    Identification
                </button>

                <button
                    type="button"
                    disabled={isProcessing}
                    onClick={startVerification}
                >
                    Verification
                </button>

            </div>

            {showPersonSelection && (
                <div style={{ marginTop: 16 }}>
                    <label htmlFor="verification-person">
                        Person to verify
                    </label>

                    <select
                        id="verification-person"
                        value={selectedPersonId}
                        disabled={isProcessing}
                        onChange={(event) =>
                            setSelectedPersonId(event.target.value)
                        }
                    >
                        <option value="">Select a person</option>
                        {

                        }
                        {people.map((person) => (
                            <option key={person}>
                                {person}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        disabled={isProcessing || !selectedPersonId}
                        onClick={() => void confirmVerification()}
                    >
                        Verify selected person
                    </button>

                    <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => {
                            setShowPersonSelection(false);
                            setSelectedPersonId("");
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {message && <p>{message}</p>}
        </section>
    );
}