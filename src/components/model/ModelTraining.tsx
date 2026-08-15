import { type StringStreamOptions, useStartableStringStream } from "../../helpers/Streams.ts";
import {
    fetchTrainingStatus,
    getModelTrainingMessagesStream,
    startModelTraining,
    stopModelTraining
} from "../../api/model.ts";
import {useCallback, useEffect, useState} from "react";
import { getErrorMessage } from "../../helpers/Errors.ts";
import styles from "../../Styles/Styles.module.css";


export function ModelTraining(){
    const [lockButtons, setLockButtons] = useState<boolean>(false);
    const [trainingMessage, setTrainingMessage] = useState('');
    const [isTraining, setIsTraining] = useState(false);
    const [errorText, setErrorText] = useState<string>("");





    const waitUntilTrainingStopped = async () => {
        while (true) {
            setLockButtons(true)
            const response = await fetchTrainingStatus();

            if (response.isTraining) {
                setIsTraining(true);
            } else {
                setIsTraining(false);
            }

            if (!response.isAborting) {
                setLockButtons(false)
                break;
            }

            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }


    const updateTrainingStatus  = async () =>{
        setErrorText("")
        try {
            const response = await fetchTrainingStatus();

            setIsTraining(response.isTraining);
            if (response.isTraining)
                if (trainingMessage==="")
                    setTrainingMessage("Waiting for next Status update.")
                startMessageStream()

            if (response.isAborting)
                await waitUntilTrainingStopped();

        } catch (error) {
            const error_string = getErrorMessage(error, "Failed to start training")
            setErrorText(error_string)
            console.error(error_string);
        }
    }




    const startTraining = async () => {
        prepareForButtonPress()
        try {

            const response = await startModelTraining();
            if (response.success)
                setIsTraining(true)
            startMessageStream()
            await updateTrainingStatus()

        } catch (error) {
            const error_string = getErrorMessage(error, "Failed to start training")

            setErrorText(error_string)
            console.error(error_string);
        }

    }

    const prepareForButtonPress = () => {
        setTrainingMessage("")
        setErrorText("")
    }

    const stopTraining = async () => {
        prepareForButtonPress()
        try {
            const response = await stopModelTraining();
            if (response.success){
                setTrainingMessage("Stopping Training...")
                await waitUntilTrainingStopped()
            }
            stop()
        } catch (error) {
            console.log(getErrorMessage(error, "Failed to stop training"));
        }
        setTrainingMessage("Training stopped.")

    }

    const streamProps: StringStreamOptions = {
        url: getModelTrainingMessagesStream(),
        onValue: useCallback((text:string)=>{if(isTraining) setTrainingMessage(text)},[isTraining]),
        onError:(error:Event)=>console.error(error),
        onCompleted: ()=>setIsTraining(false)
    };



    const {
        startMessageStream,
        isActive
    } = useStartableStringStream(streamProps)


    useEffect(() => {
        void updateTrainingStatus()
    }, []);

    useEffect(() => {
        console.log("isactive", isActive)
        },[isActive])



    return (
        <>
            <div>
                <button
                    type="button"
                    disabled={isTraining || lockButtons}
                    onClick={startTraining}
                    className={`${styles.button} ${styles.primary}`}
                >
                    Start Training
                </button>

                <button
                    type="button"
                    disabled={!isTraining || lockButtons}
                    onClick={stopTraining}
                    className={`${styles.button} ${styles.secondary}`}
                >
                    Stop Training
                </button>
            </div>
            <p className={`${styles.text} ${styles.dynamic_info}`}>{trainingMessage}</p>
            <p className={`${styles.text} ${styles.error}`}>{errorText}</p>
        </>
    )

}