import {useCallback, useState} from "react";
import {CameraInteraction} from "../commons/CameraInteraction.tsx";
import {VerIdentControls} from "./VerIdentControls.tsx";
import IdentResults from "./IdentResults.tsx";
import type {IdentifyPersonEval} from "../../api/camera.ts";


export function VerIdent() {
    const [message, setMessage] = useState("");


    const [identMessages, setIdentMessages] = useState<IdentifyPersonEval[]>([]);
    const [identifiedPerson, setIdentifiedPerson] = useState<string>("");
    const [progress, setProgress]  = useState( {
        person:"",
        progress:0
    })






    const updateIdentMessages = {
        add:  useCallback((res: IdentifyPersonEval) => {
            setIdentMessages([...(identMessages), res])
            setProgress({person:"", progress:-1})
        },[identMessages]),
        clear: useCallback(() =>{
            setProgress({person:"", progress:-1})
            setIdentMessages([])
            setIdentifiedPerson("")
        },[]),
        setIdentifiedPerson: useCallback((person:string) =>{
            setIdentifiedPerson(person)
        },[]),
        updateProgress:useCallback((person:string, progress:number)=>{
            setProgress({person:person, progress:progress});
        },[])
    }



    return (
        <CameraInteraction message={message} setMessage={setMessage}>

            <VerIdentControls
                setMessage={setMessage}
                updateIdentMessages={updateIdentMessages}
            />
            {identMessages && (<IdentResults items={identMessages} identifiedPerson={identifiedPerson}/>)}
            {progress.person && (<p> Person {progress.person} analyzing... {(100*Number(progress.progress)).toFixed(3)}% </p>)}

        </CameraInteraction>
    );
}