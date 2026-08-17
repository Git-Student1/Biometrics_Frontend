import {useState } from "react";
import styles from "../../Styles/Styles.module.css";
import {VerIdentImageRecordingControls} from "./VerIdentImageRecoringControls.tsx";

import {VerIdentBaseMenu} from "./VerIdentBaseMenu.tsx";
import {VerPersonSelection} from "./VerPersonSelection.tsx";
import type {IdentifyPersonEval} from "../../api/camera.ts";


type Props = {
    setMessage: (text: string) => void
    updateIdentMessages: {
        add: (res: IdentifyPersonEval) => void
        clear: () => void
        setIdentifiedPerson: (person: string) => void
    }
}

type PredictionMenuState =
    "baseMenu" |
    "baseMenu-VerPersonSelection" |
    "recording" |
    "addPerson"

export function VerIdentControls({setMessage, updateIdentMessages}:Props) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [predictionMenuState, setPredictionMenuState] = useState<PredictionMenuState>("baseMenu")



    const showAddNewPeopleDialog = () => {
        setPredictionMenuState("recording")
    }

    const showVerificationSelection = () => {
        setPredictionMenuState("baseMenu-VerPersonSelection")
    }


    return (
        <>
                <div>
                    {( predictionMenuState === "baseMenu"
                    || predictionMenuState === "baseMenu-VerPersonSelection") && (
                        <VerIdentBaseMenu
                            updateIdentMessages={updateIdentMessages}
                            setIsProcessing={setIsProcessing}
                            onVerify={showVerificationSelection}
                            onAddNewPerson={showAddNewPeopleDialog}
                            disableButtons={predictionMenuState!=="baseMenu"||isProcessing}
                        />
                    )}

                    {predictionMenuState ==="baseMenu-VerPersonSelection" && (
                        <VerPersonSelection
                            setMessage={setMessage}
                            onStartVerify={()=>{
                                setPredictionMenuState("baseMenu")
                                setIsProcessing(true); }}
                            onEndVerify={ ()=>setIsProcessing(false)}
                            onClose={()=>setPredictionMenuState("baseMenu")}
                        />
                    )}

                    {predictionMenuState ==="recording" && (
                        <div>
                            <VerIdentImageRecordingControls/>
                            <button
                                type="button"
                                className={`${styles.button} ${styles.secondary}`}
                                onClick={()=> setPredictionMenuState("baseMenu")}
                            >
                                Close
                            </button>
                        </div>
                    )}

                </div>
        </>)

}