import {useState} from "react";

import {type ButtonProp} from "./PersonSelection.tsx"

import {ImageRecordingControls} from "./ImageRecordingControls.tsx";
import {VerIdentImageCount} from "./VerIdentImageCount.tsx";
import {startRecordingVerIdent} from "../api/camera.ts";

import {addVerIdentPerson, fetchAllVerIdentPeople} from "../api/people.ts";

export function VerIdentImageRecordingControls() {
    const [errorMessage,  setErrorMessage] = useState("");

    const [recordingPerson, setRecordingPerson] = useState<string>("")
    const [isShowImageCount, setIsShowImageCount] = useState<boolean>(false);







    const buttonProps: ButtonProp[] = [
        {
            text: "Start Recording",
            func:  startRecordingVerIdent

        }
    ]

    return (
        <>
            <ImageRecordingControls
                setRecordingPerson={setRecordingPerson}
                setIsShowImageCount={setIsShowImageCount}
                buttonProps={buttonProps}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                fetchPeopleFn={fetchAllVerIdentPeople}
                addPeopleFn={addVerIdentPerson}
                selectButtonBeforeSelection={false}
            />
            { isShowImageCount &&(<VerIdentImageCount recordingPerson={recordingPerson}/>)}



        </>
    );

}


