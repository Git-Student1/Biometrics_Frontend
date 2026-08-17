import styles from "../../Styles/Styles.module.css";
import {useCallback} from "react";
import {
    doIdentification,
    getIdentificationMessageStream,
    type IdentifyMessage,
    type IdentifyPersonEval
} from "../../api/camera.ts";
import {getErrorMessage} from "../../helpers/Errors.ts";
import {type StringStreamOptions, useStartableStringStream} from "../../helpers/Streams.ts";



export type Props = {
    onAddNewPerson:()=>void
    disableButtons: boolean;
    setIsProcessing: (value: (((prevState: boolean) => boolean) | boolean)) => void
    onVerify: ()=>void
    updateIdentMessages:  {
        add: (res: IdentifyPersonEval) => void
        clear: () => void
        setIdentifiedPerson: (person: string) => void
        updateProgress: (person: string, progress: number) => void
    }
}




export function VerIdentBaseMenu({updateIdentMessages, disableButtons,setIsProcessing, onAddNewPerson, onVerify}:Props) {

    const streamProps: StringStreamOptions = {
        url: getIdentificationMessageStream(),
        onValue:(message:string)=> {
            const identMessage: IdentifyMessage = JSON.parse(message);

            if (identMessage.type === "person_eval") {
                updateIdentMessages.add(identMessage);
            }
            else if (identMessage.type === "result"){
                updateIdentMessages.setIdentifiedPerson(identMessage.person)
            }
            else if (identMessage.type === "person_progress"){
                updateIdentMessages.updateProgress(identMessage.person, identMessage.analysed/identMessage.total)
            }
            else{
                console.error("Ident Message should have type result or person_eval but was:", identMessage.type )
                console.error("problematic identMessage:", identMessage)
            }

        },
        onError:(error:Event)=>{
            console.error(error)
            setIsProcessing(false)
        },
        onCompleted: ()=>setIsProcessing(false)
    };


    const {
        startMessageStream,
        isActive
    } = useStartableStringStream(streamProps)


    const startIdentification = useCallback(async () => {
        setIsProcessing(true);
        updateIdentMessages.clear();

        try {
            const { success, details } = await doIdentification();
            startMessageStream()
            if (success)
                setIsProcessing(true)
        } catch (error) {
            console.error(getErrorMessage(error, "Camera action failed"));
        }
    }, []);

    return (
        <div>
            <div>
                <button
                    type="button"
                    disabled={disableButtons }
                    onClick={onAddNewPerson}
                    className={`${styles.button} ${styles.primary}`}
                >
                    Add new people or images
                </button>
            </div>

            <div>
                <button
                    type="button"
                    disabled={disableButtons }
                    onClick={startIdentification}
                    className={`${styles.button} ${styles.primary}`}
                >
                    Identification
                </button>

                <button
                    type="button"
                    disabled={disableButtons}
                    onClick={onVerify}
                    className={`${styles.button} ${styles.primary}`}
                >
                    Verification
                </button>

            </div>
        </div>
        )
}