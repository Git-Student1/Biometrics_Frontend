import { type StringStreamOptions, useStartableStringStream } from "../../helpers/Streams.ts";
import {
    fetchTrainingStatus,
    getModelTrainingMessagesStream,
    startModelTraining,
    stopModelTraining
} from "../../api/model.ts";
import {useEffect, useState} from "react";
import { getErrorMessage } from "../../helpers/Errors.ts";
import styles from "../../Styles/Styles.module.css";


export function ModelTraining(){
    const [trainingMessage, setTrainingMessage] = useState('');
    const [isTraining, setIsTraining] = useState(false);
    const [errorText, setErrorText] = useState<string>("");





    const waitUntilTrainingStopped = async () => {
        while (true) {
            const response = await fetchTrainingStatus();

            if (response.isTraining) {
                setIsTraining(true);
            } else {
                setIsTraining(false);
            }

            if (!response.isAborting) {
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
        setErrorText("")
        try {

            const response = await startModelTraining();
            if (response.success)
                setIsTraining(true)
            startMessageStream()

        } catch (error) {
            const error_string = getErrorMessage(error, "Failed to start training")

            setErrorText(error_string)
            console.error(error_string);

            await updateTrainingStatus()
        }
    }

    const stopTraining = async () => {

        try {
            const response = await stopModelTraining();
            if (response.success)
                setIsTraining(false)
            stop()
        } catch (error) {
            console.log(getErrorMessage(error, "Failed to stop training"));
        }
    }

    const streamProps: StringStreamOptions = {
        url: getModelTrainingMessagesStream(),
        onValue: (text:string)=>setTrainingMessage(text),
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
                    disabled={isTraining}
                    onClick={startTraining}
                    className={`${styles.button} ${styles.primary}`}
                >
                    Start Training
                </button>

                <button
                    type="button"
                    disabled={!isTraining}
                    onClick={stopTraining}
                    className={`${styles.button} ${styles.secondary}`}
                >
                    Stop Training
                </button>
            </div>
            <p className={`${styles.text} ${styles.info}`}>{trainingMessage}</p>
            <p className={`${styles.text} ${styles.error}`}>{errorText}</p>
        </>
    )

}