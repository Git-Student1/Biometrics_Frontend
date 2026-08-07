import {
    getCameraRecordingStatus, getNumberAncStreamUrl,
    getNumberPosStreamUrl,
    startRecordingAnc,
    startRecordingPos,
    stopRecording
} from "../api/modelApi";
import {useCallback, useState} from "react";
import axios from "axios";
import {type ButtonProp, PersonSelection} from "./PersonSelection.tsx"
import {type NumberStreamOptions, useNumberStream} from "../helpers/Streams.ts";

export function PosImageRecordingControls() {
    const [errorMessage,  setErrorMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [imgNumberPos, setImgNumberPos] = useState<number>(0);
    const [imgNumberAnc, setImgNumberAnc] = useState<number>(0);

    const [recordingPerson, setRecordingPerson] = useState<string>("")
    const [isRecording, setIsRecording] = useState<boolean>(false);

    const [isShowImageCount, setIsShowImageCount] = useState<boolean>(false);
    const [isShowPeopleSelection, setIsShowPeopleSelection] = useState(false);


    const checkIsRecording = async () =>{
        setIsProcessing(true);
        try{
            const response = await getCameraRecordingStatus();

            if (response.recording!== undefined && typeof (response.recording)==="boolean")
                setIsRecording(response.recording);
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        } finally {
            setIsProcessing(false);
        }
        }



    const startImageRecording = useCallback(async (person:string, apiFunc:(person:string)=>Promise<void>) => {
        setIsShowPeopleSelection(false);
        setIsProcessing(true);
        try {
            await apiFunc(person);
            await checkIsRecording()
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        } finally {
            setIsProcessing(false);
        }
    }, [imgNumberPos]);


    const posStreamOptions:NumberStreamOptions = {
        url: recordingPerson? getNumberPosStreamUrl(recordingPerson):null,
        onValue: (count: number)=> setImgNumberPos(count),
        onError: () => {
            console.error("Recording status stream failed.")
            setErrorMessage("Recording status stream failed.");
        }
    }

    const ancStreamOptions:NumberStreamOptions = {
        url: recordingPerson?  getNumberAncStreamUrl(recordingPerson): null,
        onValue: (count: number)=> setImgNumberAnc(count),
        onError: () => {
            console.error("Recording status stream failed.")
            setErrorMessage("Recording status stream failed.");
        }
    }

    useNumberStream(posStreamOptions)
    useNumberStream(ancStreamOptions)



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

    const buttonProps: ButtonProp[] = [
        {
            text: "Start Recording Pos",
            func: (person:string)=>startImageRecording(person, startRecordingPos)

        },
        {
            text:"Start Recording Anc",
            func: (person:string)=>startImageRecording(person, startRecordingAnc)
        }
    ]

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

            onPersonSelect={ (person:string)=>{
                try {
                    setRecordingPerson(person)
                    setIsShowImageCount(true)
                }
                catch (error) {
                    console.error(error);
                }
            }}
            buttonProps={buttonProps}
            onClose={()=>setIsShowPeopleSelection(false)}
            />)}

            {isShowImageCount && (<p>
                Current images for person "{recordingPerson}": pos {imgNumberPos}, anc {imgNumberAnc}
            </p>)}

            {(errorMessage &&  false) && (<p>
                {errorMessage}
            </p>)}
        </>)

}


