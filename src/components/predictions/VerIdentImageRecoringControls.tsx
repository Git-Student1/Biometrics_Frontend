import {useState} from "react";

import {type ButtonProp} from "../commons/PersonSelection.tsx"

import {ImageRecordingControls} from "../commons/ImageRecordingControls.tsx";
import {startRecordingVerIdent} from "../../api/camera.ts";

import {addVerIdentPerson, fetchAllVerIdentPeople} from "../../api/people.ts";

import {VerIdentImageCount} from "./VerIdentImageCount.tsx";

export function VerIdentImageRecordingControls() {

    const [recordingPerson, setRecordingPerson] = useState<string>("")



    const buttonProps: ButtonProp[] = [
        {
            text: "Start Recording",
            func:  startRecordingVerIdent

        }
    ]


    return (
        <>
            <ImageRecordingControls
                onPersonSelected={setRecordingPerson}
                onRecordingStopped={()=>setRecordingPerson("")}
                personConfirmButtonProps={buttonProps}
                fetchPeopleFn={fetchAllVerIdentPeople}
                addPeopleFn={addVerIdentPerson}
                selectButtonBeforeSelection={false}
            />

            { recordingPerson &&( <VerIdentImageCount recordingPerson={recordingPerson}/> )}

        </>
    );

}


