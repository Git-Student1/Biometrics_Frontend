import {type ReactNode, useEffect, useState} from "react";


import axios from "axios";
import styles from "../../Styles/Styles.module.css"
import {getCameraStatus, getCameraStreamUrl} from "../../api/camera.ts";


type Props  = {
    children: ReactNode;
    message: string
    setMessage:  React.Dispatch<React.SetStateAction<string>>;
}



export function CameraInteraction({children, message, setMessage}:Props) {

    const [streamReady, setStreamReady] = useState(false);

    useEffect(() => {
        async function checkCamera() {
            try {
                const status = await getCameraStatus();

                if (!status.active) {
                    setMessage(
                        status.error ?? "Server failed to access the camera.",
                    );
                    return;
                }

                setStreamReady(true);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setMessage(
                        error.response?.data?.detail ??
                        error.message,
                    );
                } else {
                    console.error(error);
                    setMessage("Could not check camera status.");
                }
            }
        }

        void checkCamera();
    }, [setMessage]);

    return (
        <div className={styles.cameraInteraction}>
            <div>
            {(streamReady && <img
                src={getCameraStreamUrl()}
                alt="Live camera"
                width={250}
                height={250}

                onLoad={() => {
                    console.log("Camera stream loaded");
                }}
                onError={(event) => {
                    setStreamReady(false);
                    setMessage("The camera stream stopped unexpectedly.");
                    console.error(
                        `Camera stream failed:`,
                        getCameraStreamUrl(),
                        event,
                    );
                    setMessage("Camera stream could not be loaded");
                }}
                className={styles.cameraImage}
                />)}
            </div>

            <div>
                { streamReady && children}

                {message && <p>{message}</p>}
            </div>
        </div>
    );
}