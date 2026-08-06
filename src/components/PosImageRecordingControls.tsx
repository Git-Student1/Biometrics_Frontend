import {
    getCameraRecordingStatus,
    getNumberStreamUrl,
    startRecording,
    stopRecording
} from "../api/modelApi";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {PersonSelection} from "./PersonSelection.tsx"

export function PosImageRecordingControls() {
    const [errorMessage,  setErrorMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [imgNumber, setImgNumber] = useState<number>(0);
    const [recordingPerson, setRecordingPerson] = useState<string>("")
    const [isRecording, setIsRecording] = useState<boolean>(false);

    const [isShowImageCount, setIsShowImageCount] = useState<boolean>(false);
    const [isShowPeopleSelection, setIsShowPeopleSelection] = useState(false);


    const checkIsRecording = async () =>{
        console.log ("image count", isShowImageCount)
        setIsProcessing(true);
        try{
            const response = await getCameraRecordingStatus();

            if (response.recording!== undefined && typeof (response.recording)==="boolean")
                setIsRecording(response.recording);
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        } finally {
            setIsProcessing(false);
            console.log(isProcessing);
        }
        }

    const startImageRecording = useCallback(async (person:string) => {
        setIsShowPeopleSelection(false);
        setIsProcessing(true);
        try {
            await startRecording(person);
            await checkIsRecording()
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
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
            console.error("Recording status stream failed.")
            setErrorMessage("Recording status stream failed.");
        };

        return () => {
            eventSource.close();
        };
    }, [recordingPerson, setErrorMessage,]);

    useEffect(() => {
        console.log("isShowImageCount changed:", isShowImageCount);
    }, [isShowImageCount]);

/**
    useEffect(() => {
        type CameraStatus = {
            recording: boolean;
        };


        const eventSource = new EventSource(
            getCameraStatusStream(),
        );

        eventSource.onmessage = (event:MessageEvent<string>) => {
            const status = JSON.parse(event.data) as CameraStatus;
            if (status.recording!== undefined)
                setRecordingRecording(status.recording)
        };
        eventSource.onerror = () => {
            console.error("Recording status stream failed.")
            setErrorMessage("Recording status stream failed.");
        };

        return () => {
            eventSource.close();
        };
    }, [recordingPerson, setErrorMessage]);
        */

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
            <button
                type="button"
                disabled={isProcessing || isShowPeopleSelection || isRecording}
                onClick={()=> {
                 setIsShowPeopleSelection(true);

                }}
            >
                Select Person for Recording
            </button>

            <button
                type="button"
                disabled={isProcessing || isShowPeopleSelection || !isRecording}
                onClick={()=> {
                    stopRecording().then(() => {
                        setIsShowImageCount(false);
                        setRecordingPerson("")
                        void checkIsRecording()
                    })

                }}
            >
                Stop Recording
            </button>


            { isShowPeopleSelection && (<PersonSelection
            confirmButtonText={"Start Recording"}
            onPersonSelect={ (person:string)=>{
                try {
                    setRecordingPerson(person)
                    setIsShowImageCount(true)
                }
                catch (error) {
                    console.error(error);
                }
            }}
            onPersonConfirm={startImageRecording}
            />)}

            {isShowImageCount && (<p>
                Current images for person "{recordingPerson}": {imgNumber}
            </p>)}

            {errorMessage && (<p>
                {errorMessage}
            </p>)}
        </>)

}