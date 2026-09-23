import { useState } from "react";
import styles from "../../../Styles/Styles.module.css";
import {VerIdentImageRecordingControls} from "./PredictionImageRecoringControls.tsx";

import {PredictionBaseMenu} from "./PredictionBaseMenu.tsx";
import {VerPersonSelection} from "./VerPersonSelection.tsx";
import {
    usePredictionFunctionalityContext,
} from "../../../hooks/ContextHooks.ts";



type PredictionMenuState =
    "baseMenu" |
    "baseMenu-VerPersonSelection" |
    "recording" |
    "addPerson"

export function PredictionControls() {
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
                        <PredictionBaseMenu
                            onVerify={showVerificationSelection}
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


                </div>
        </>)

}