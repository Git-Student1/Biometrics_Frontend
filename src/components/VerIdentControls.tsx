import {doIdentification, doVerification} from "../api/modelApi";
import {useCallback, useState } from "react";
import axios from "axios";
import {type ButtonProp, PersonSelection} from "./PersonSelection.tsx";
import styles from "../Styles/Styles.module.css";


type Props = {
    setMessage: React.Dispatch<React.SetStateAction<string>>
}

export function VerIdentControls({setMessage}:Props) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isShowPeopleSelection, setIsShowPeopleSelection] = useState(false);

    const runIdentification = useCallback(async () => {
        setIsProcessing(true);
        setMessage("");

        try {
            const { result, details } = await doIdentification();
            setMessage(`result: ${result} \n details: ${details}`);
        } catch (error) {
            setMessage(getErrorMessage(error));
        } finally {
            setIsProcessing(false);
        }
    }, []);



    // @ts-ignore
    const runVerification = async (selectedPersonId:string) => {
        if (!selectedPersonId) {
            setMessage("Select a person first.");
            return;
        }
        const response = await doVerification(selectedPersonId);
        setMessage(`Result: ${response.result}`);
    }

    const getErrorMessage = (error: unknown): string => {
        if (axios.isAxiosError(error)) {
            const detail = error.response?.data?.detail;

            return typeof detail === "string"
                ? detail
                : error.message;
        }

        return error instanceof Error
            ? error.message
            : "Camera action failed";
    };

    const buttonProps: ButtonProp[] = [
        {
            text: "Verify",
            func: async (person:string) =>{
                setIsShowPeopleSelection(false)
                setIsProcessing(true);
                await runVerification(person)
                setIsProcessing(false);
            }

        }
    ]

    return (
    <div>
        <button
            type="button"
            disabled={isProcessing || isShowPeopleSelection }
            onClick={runIdentification}
            className={`${styles.button} ${styles.primary}`}
        >
            Identification
        </button>


        <button
            type="button"
            disabled={isProcessing || isShowPeopleSelection }
            onClick={()=>setIsShowPeopleSelection(true)}
            className={`${styles.button} ${styles.primary}`}
        >
            Verification
        </button>

        {isShowPeopleSelection && (<PersonSelection
            onPersonSelect={()=>{}}
            buttonProps = {buttonProps}
            onClose={()=>setIsShowPeopleSelection(false)}

        />)}
        

        </div>)

}