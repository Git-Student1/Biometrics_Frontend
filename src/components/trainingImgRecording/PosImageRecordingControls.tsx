import {useState} from "react";

import {type ButtonProp} from "../commons/PersonSelection.tsx"
import {type NumberStreamOptions, useNumberStream} from "../../helpers/Streams.ts";
import styles from "../../Styles/Styles.module.css"
import {ImageRecordingControls} from "../commons/ImageRecordingControls.tsx";
import {startRecordingAnc, startRecordingPos} from "../../api/camera.ts";

import {addTrainingPerson, fetchTrainingPeople, getNumberAncStreamUrl, getNumberPosStreamUrl} from "../../api/people.ts";

export function PosImageRecordingControls() {
    const [imgNumberPos, setImgNumberPos] = useState<number>(0);
    const [imgNumberAnc, setImgNumberAnc] = useState<number>(0);

    const [recordingPerson, setRecordingPerson] = useState<string>("")



    const posStreamOptions:NumberStreamOptions = {
        url: recordingPerson? getNumberPosStreamUrl(recordingPerson):null,
        onValue: (count: number)=> setImgNumberPos(count),
    }

    const ancStreamOptions:NumberStreamOptions = {
        url: recordingPerson?  getNumberAncStreamUrl(recordingPerson): null,
        onValue: (count: number)=> setImgNumberAnc(count),
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
              onPersonSelected={setRecordingPerson}
              onRecordingStopped={()=>setRecordingPerson("")}
              personConfirmButtonProps={buttonProps}
              fetchPeopleFn={fetchTrainingPeople}
              addPeopleFn={addTrainingPerson}
              selectButtonBeforeSelection={true}
          />
            {recordingPerson && (
                <p className={`${styles.text} ${styles.dynamic_info}`}>
                    Current images for person "{recordingPerson}": pos {imgNumberPos}, anc {imgNumberAnc}
                </p>)
            }

        </>
    );

}


