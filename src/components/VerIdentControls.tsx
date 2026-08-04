import {doIdentification, doVerification, fetchPeopleForVerification} from "../api/modelApi";
import {useCallback, useState } from "react";
import axios from "axios";


type Props = {
    setMessage: React.Dispatch<React.SetStateAction<string>>
}

export function VerIdentControls({setMessage}:Props) {
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

    // @ts-ignore
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
        } catch (error) {
            setMessage(getErrorMessage(error));
        } finally {
            setIsProcessing(false);
        }
    }, [selectedPersonId]);

    const getErrorMessage = (error: unknown): string => {
        if (axios.isAxiosError(error)) {
            const detail = error.response?.data?.detail;

            return typeof detail === "string"
                ? detail
                : error.message;
        }

        return error instanceof Error
            ? error.message
            : "Camera action failed";
    };

    return (
    <>
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
        </>)

}