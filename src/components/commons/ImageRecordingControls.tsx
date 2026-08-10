import {useEffect, useState} from "react";
import {type ButtonProp, PersonSelection} from "./PersonSelection.tsx"
import styles from "../../Styles/Styles.module.css"
import {getErrorMessage} from "../../helpers/Errors.ts";
import {stopRecording} from "../../api/camera.ts";
import {checkIsRecording} from "../../helpers/CameraHelper.ts";


export type Props = {
    setRecordingPerson:  React.Dispatch<React.SetStateAction<string>>
    setIsShowImageCount: React.Dispatch<React.SetStateAction<boolean>>
    buttonProps: ButtonProp[]
    errorMessage: string
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
    fetchPeopleFn:()=>Promise<string[]>
    addPeopleFn:(person:string)=>Promise<void>
    selectButtonBeforeSelection: boolean
}


export function ImageRecordingControls({buttonProps, setRecordingPerson, setIsShowImageCount, errorMessage, setErrorMessage, fetchPeopleFn, addPeopleFn, selectButtonBeforeSelection}: Props) {
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
          void stopRecording();
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


    buttonProps = buttonProps.map((prop) => {return {
        text:prop.text,
        func:(person:string) =>   startImageRecording(person, prop.func)
    }})


    const stopImageRecording =  async () =>{
        await stopRecording()
        setIsShowImageCount(false);
        setRecordingPerson("")
        setIsRecording(await checkIsRecording())

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
                    onPersonSelect={ (person:string)=>{
                        try {
                            setRecordingPerson(person)
                            setIsShowImageCount(true)
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }}
                    buttonProps={buttonProps}
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


