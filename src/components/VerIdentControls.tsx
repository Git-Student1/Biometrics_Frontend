import {doIdentification, doVerification} from "../api/modelApi";
import {useCallback, useState } from "react";
import axios from "axios";
import {CameraControls} from "./CameraControls.tsx";


type Props = {
    setMessage: React.Dispatch<React.SetStateAction<string>>
}

export function VerIdentControls({setMessage}:Props) {
    const [isProcessing, setIsProcessing] = useState(false);

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
    const confirmVerification = useCallback(async (selectedPersonId:string) => {
        if (!selectedPersonId) {
            setMessage("Select a person first.");
            return;
        }
        const response = await doVerification(selectedPersonId);
        setMessage(`Result: ${response.result}`);
    }, );

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
        <CameraControls setMessage={setMessage} onPersonSelect={confirmVerification} alwaysShowPeople={false} isProcessing={isProcessing} setIsProcessing={setIsProcessing} >
             <button
                type="button"
                disabled={isProcessing}
                onClick={runIdentification}
            >
                Identification
            </button>
       </CameraControls>
        </>)

}