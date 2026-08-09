import {
    addTrainingPerson,
    fetchTrainingPeople,
    getNumberAncStreamUrl,
    getNumberPosStreamUrl,
    startRecordingAnc,
    startRecordingPos,
} from "../api/modelApi";
import {useState} from "react";

import {type ButtonProp} from "./PersonSelection.tsx"
import {type NumberStreamOptions, useNumberStream} from "../helpers/Streams.ts";
import styles from "../Styles/Styles.module.css"
import {ImageRecordingControls} from "./ImageRecordingControls.tsx";

export function PosImageRecordingControls() {
    const [errorMessage,  setErrorMessage] = useState("");
    const [imgNumberPos, setImgNumberPos] = useState<number>(0);
    const [imgNumberAnc, setImgNumberAnc] = useState<number>(0);

    const [recordingPerson, setRecordingPerson] = useState<string>("")
    const [isShowImageCount, setIsShowImageCount] = useState<boolean>(false);



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



    const buttonProps: ButtonProp[] = [
        {
            text: "Start Recording Pos",
            func:  startRecordingPos

        },
        {
            text:"Start Recording Anc",
            func: startRecordingAnc
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
              fetchPeopleFn={fetchTrainingPeople}
              addPeopleFn={addTrainingPerson}
          />
            {isShowImageCount && (
                <p className={`${styles.text} ${styles.info}`}>
                    Current images for person "{recordingPerson}": pos {imgNumberPos}, anc {imgNumberAnc}
                </p>)
            }

        </>
    );

}


