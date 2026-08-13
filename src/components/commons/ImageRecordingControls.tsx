import {useEffect, useState} from "react";
import {type ButtonProp, PersonSelection} from "./PersonSelection.tsx"
import styles from "../../Styles/Styles.module.css"
import {getErrorMessage} from "../../helpers/Errors.ts";
import {stopRecording} from "../../api/camera.ts";
import {checkIsRecording} from "../../helpers/CameraHelper.ts";


export type Props = {
    onPersonSelected: (person:string) => void;
    onRecordingStopped: () => void;
    personConfirmButtonProps: ButtonProp[]
    fetchPeopleFn:()=>Promise<string[]>
    addPeopleFn:(person:string)=>Promise<void>
    selectButtonBeforeSelection: boolean
}


export function ImageRecordingControls({onPersonSelected, onRecordingStopped, personConfirmButtonProps: personConfirmButtonProps, fetchPeopleFn, addPeopleFn, selectButtonBeforeSelection}: Props) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRecording, setIsRecording] = useState<boolean>(false);


    const [doShowPeopleSelection, setDoShowPeopleSelection] = useState(!selectButtonBeforeSelection);


    useEffect(()=>{
        if (isRecording)
            setDoShowPeopleSelection(false)
        else if (!selectButtonBeforeSelection)
            setDoShowPeopleSelection(true)
    }, [isRecording, doShowPeopleSelection])

    useEffect(()=> {
      return ()=>{
          void stopImageRecording();
      }
    }, [])



    const startImageRecording = async (person:string, apiFunc:(person:string)=>Promise<void>) => {
        setDoShowPeopleSelection(false);
        setIsProcessing(true);
        try {
            await apiFunc(person);
            setIsRecording(await checkIsRecording())
        } catch (error) {
            setErrorMessage(getErrorMessage(error, "Camera action failed"));
        } finally {
            setIsProcessing(false);
        }
    };


    personConfirmButtonProps = personConfirmButtonProps.map((prop) => {return {
        text:prop.text,
        func:(person:string) =>   startImageRecording(person, prop.func)
    }})


    const stopImageRecording =  async () =>{
        await stopRecording()

        const isRecording = await checkIsRecording()
        setIsRecording(isRecording)
        if (!isRecording)
            onRecordingStopped()


    }



    return (
        <>
        {selectButtonBeforeSelection && (<button
                type="button"
                disabled={isProcessing || doShowPeopleSelection || isRecording}
                onClick={()=> {
                    setDoShowPeopleSelection(true);

                }}
                className={`${styles.button} ${styles.primary}`}
            >
                Select Person for Recording
            </button>)}

            <button
                type="button"
                disabled={isProcessing || doShowPeopleSelection || !isRecording}
                onClick={stopImageRecording}
                className={`${styles.button} ${styles.secondary}`}
            >
                Stop Recording
            </button>


            { doShowPeopleSelection && (
                <PersonSelection
                    onPersonSelect={onPersonSelected}
                    buttonProps={personConfirmButtonProps}
                    onClose={selectButtonBeforeSelection?()=>setDoShowPeopleSelection(false):undefined}
                    addNewPerson={addPeopleFn}
                    fetchPeopleFn={fetchPeopleFn}
                />)
            }

            {(errorMessage &&  false) && (
                <p className={`${styles.text} ${styles.error}`}>
                    {errorMessage}
                </p>)
            }
        </>)

}


