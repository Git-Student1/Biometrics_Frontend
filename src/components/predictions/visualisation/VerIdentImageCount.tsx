import styles from "../../../Styles/Styles.module.css";
import {type NumberStreamOptions, useNumberStream} from "../../../helpers/Streams.ts";
import {useState} from "react";

import {getNumberImgVerIdentStreamUrl} from "../../../api/people.ts";


export type Props = {
    recordingPerson: string

}

export function VerIdentImageCount({recordingPerson}: Props) {
    const [imgNumber, setImgNumber] = useState<number>(0);



    const streamOptions:NumberStreamOptions = {
        url: recordingPerson? getNumberImgVerIdentStreamUrl(recordingPerson):null,
        onValue: (count: number)=> setImgNumber(count),
        onError: () => {
            console.error("Recording status stream failed.")
        }
    }
    useNumberStream(streamOptions)

    return (
            <p className={`${styles.text} ${styles.dynamic_info}`}>
                Current images for person "{recordingPerson}": {imgNumber}
            </p>)

}