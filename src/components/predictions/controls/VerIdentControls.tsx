import { useState } from "react";
import styles from "../../../Styles/Styles.module.css";
import {VerIdentImageRecordingControls} from "./VerIdentImageRecoringControls.tsx";

import {VerIdentBaseMenu} from "./VerIdentBaseMenu.tsx";
import {VerPersonSelection} from "./VerPersonSelection.tsx";
import {
    usePredictionFunctionalityContext,
} from "../../../hooks/ContextHooks.ts";



type PredictionMenuState =
    "baseMenu" |
    "baseMenu-VerPersonSelection" |
    "recording" |
    "addPerson"

export function VerIdentControls() {
    const [predictionMenuState, setPredictionMenuState] = useState<PredictionMenuState>("baseMenu")
    const predicitonFunctionality = usePredictionFunctionalityContext()



    const showAddNewPeopleDialog = () => {
        predicitonFunctionality.clear()
        setPredictionMenuState("recording")
    }

    const showVerificationSelection = () => {
        predicitonFunctionality.clear()
        setPredictionMenuState("baseMenu-VerPersonSelection")
    }


    return (
        <>
                <div>
                    {( predictionMenuState === "baseMenu"
                    || predictionMenuState === "baseMenu-VerPersonSelection") && (
                        <VerIdentBaseMenu
                            onVerify={showVerificationSelection}
                            onAddNewPerson={showAddNewPeopleDialog}
                            disableButtons={predictionMenuState!=="baseMenu"}
                        />
                    )}

                    {predictionMenuState ==="baseMenu-VerPersonSelection" && (
                        <VerPersonSelection
                            onStartVerify={()=>{
                                setPredictionMenuState("baseMenu")
                            }}
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