import {useState } from "react";
import styles from "../../Styles/Styles.module.css";
import {VerIdentImageRecordingControls} from "./VerIdentImageRecoringControls.tsx";

import {VerIdentBaseMenu} from "./VerIdentBaseMenu.tsx";
import {VerPersonSelection} from "./VerPersonSelection.tsx";


type Props = {
    setMessage: React.Dispatch<React.SetStateAction<string>>
}

type PredictionMenuState =
    "baseMenu" |
    "baseMenu-VerPersonSelection" |
    "recording" |
    "addPerson"

export function VerIdentControls({setMessage}:Props) {
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
                            setMessage={setMessage}
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