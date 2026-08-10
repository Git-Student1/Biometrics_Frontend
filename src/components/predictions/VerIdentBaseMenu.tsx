import styles from "../../Styles/Styles.module.css";
import {useCallback} from "react";
import {doIdentification} from "../../api/camera.ts";
import {getErrorMessage} from "../../helpers/Errors.ts";



export type Props = {
    onAddNewPerson:()=>void
    disableButtons: boolean;
    setIsProcessing: (value: (((prevState: boolean) => boolean) | boolean)) => void
    onVerify: ()=>void
    setMessage: React.Dispatch<React.SetStateAction<string>>
}


export function VerIdentBaseMenu({setMessage, disableButtons,setIsProcessing, onAddNewPerson, onVerify}:Props) {


    const runIdentification = useCallback(async () => {
        setIsProcessing(true);
        setMessage("");

        try {
            const { result, details } = await doIdentification();
            setMessage(`result: ${result} \n details: ${details}`);
        } catch (error) {
            setMessage(getErrorMessage(error, "Camera action failed"));
        } finally {
            setIsProcessing(false);
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
                    onClick={runIdentification}
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