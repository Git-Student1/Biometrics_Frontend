import type {StringStreamOptions} from "../Streams.ts";
import {
    getIdentificationMessageStream,
    getVerificationMessageStream,
    type IdentifyMessage,
     type VerifyMessage
} from "../../api/camera.ts";
import type { UpdatePredictionMessages } from "../../types/types.ts";




export function identStreamProps (updatePredictionMessages:UpdatePredictionMessages,setIdentifiedPerson:(person:string)=>void, onStopRunning: () => void):StringStreamOptions {
    return {
        url: getIdentificationMessageStream(),
        onValue:(message:string)=> {
            const identMessage: IdentifyMessage = JSON.parse(message);

            if (identMessage.type === "person_eval") {
                updatePredictionMessages.add(identMessage);
            }
            else if (identMessage.type === "result"){
                setIdentifiedPerson(identMessage.person)
            }
            else if (identMessage.type === "person_progress"){
                updatePredictionMessages.updateProgress(identMessage.person, identMessage.analysed/identMessage.total)
            }
            else{
                console.error("Identification Process Message should have type result, person_progress or person_eval but was:", identMessage.type )
                console.error("problematic identMessage:", identMessage)
            }
        },
        onError:(error:Event)=>{
            console.error(error)
            onStopRunning()
        },
        onCompleted: ()=>onStopRunning()
    };
}


export function verifyStreamProps (updatePredictionMessages:UpdatePredictionMessages,setIsThatPerson:(isThatPerson:boolean)=>void,onStopRunning: () => void):StringStreamOptions {
    return {
        url: getVerificationMessageStream(),
        onValue:(message:string)=> {
            const verifyMessage: VerifyMessage = JSON.parse(message);

            if (verifyMessage.type === "person_eval") {
                updatePredictionMessages.add(verifyMessage);
            }
            else if (verifyMessage.type === "result"){
                setIsThatPerson(verifyMessage.isThatPerson)

            }
            else if (verifyMessage.type === "person_progress"){
                updatePredictionMessages.updateProgress(verifyMessage.person, verifyMessage.analysed/verifyMessage.total)
            }
            else{
                console.error("Verify Process message should have type result, person_progress or person_eval but was:", verifyMessage.type )
                console.error("problematic verify message:", verifyMessage)
            }

        },
        onError:(error:Event)=>{
            console.error(error)
            onStopRunning()
        },
        onCompleted: ()=>onStopRunning()
    };
}
