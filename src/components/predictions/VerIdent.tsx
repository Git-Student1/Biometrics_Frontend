import {useCallback, useState} from "react";
import {CameraInteraction} from "../commons/CameraInteraction.tsx";
import {VerIdentControls} from "./VerIdentControls.tsx";
import IdenResultListGroup from "../commons/ListGroup.tsx";
import type {IdentifyPersonEval} from "../../api/camera.ts";


export function VerIdent() {
    const [message, setMessage] = useState("");


    const [structuredMessages, setStructuredMessages] = useState<IdentifyPersonEval[]>([]);
    const [identifiedPerson, setIdentifiedPerson] = useState<string>("");






    const updateIdentMessages = {
        add:  useCallback((res: IdentifyPersonEval) => {
            setStructuredMessages([...(structuredMessages), res])
        },[structuredMessages]),
        clear: useCallback(() =>{
            setStructuredMessages([])
        },[]),
        setIdentifiedPerson: useCallback((person:string) =>{
            setIdentifiedPerson(person)
        },[]),
    }



    return (
        <CameraInteraction message={message} setMessage={setMessage}>

            <VerIdentControls
                setMessage={setMessage}
                updateIdentMessages={updateIdentMessages}
            />
            <IdenResultListGroup items={structuredMessages}/>
        </CameraInteraction>
    );
}