import {getCameraStatusStream, getNumberStreamUrl, startRecording, stopRecording} from "../api/modelApi";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { CameraControls } from "./CameraControls.tsx";




export function PosImageRecordingControls() {
    const [message,  setMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [imgNumber, setImgNumber] = useState<number>(0);
    const [recordingPerson, setRecordingPerson] = useState<string>("")
    const [isRecording, setIsRecording] = useState<boolean>(false)



    const startImageRecording = useCallback(async (person:string) => {
        setRecordingPerson(person)
        setIsProcessing(true);
        try {
            await startRecording(person);
            setMessage(`Current images for person "${person}": ${imgNumber}.`);
        } catch (error) {
            setMessage(getErrorMessage(error));
        } finally {
            setIsProcessing(false);
        }
    }, [imgNumber]);

    useEffect(() => {
        if (!recordingPerson) {
            return;
        }
        const eventSource = new EventSource(
            getNumberStreamUrl(recordingPerson),
        );

        eventSource.onmessage = (event) => {
            console.log(event.data)
            const count = Number(event.data);


            if (!Number.isNaN(count)) {
                setImgNumber(count);
            }
        };

        eventSource.onerror = () => {
            setMessage("Number stream failed.");
        };

        return () => {
            eventSource.close();
        };
    }, [recordingPerson, setMessage]);



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
            <CameraControls
                setMessage={setMessage}
                buttonText={"Start Recording"}
                onPersonSelect={startImageRecording}
                alwaysShowPeople={true}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing} >
                <button
                    type="button"
                    disabled={isProcessing}
                    onClick={()=> {
                        stopRecording().then(() => setRecordingPerson(""))
                    }}
                >
                    Stop Recording
                </button>
            </CameraControls>
            <p>
                Current images for person "{recordingPerson}": {imgNumber}
            </p>
        </>)

}