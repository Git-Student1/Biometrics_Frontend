import styles from "../../Styles/Styles.module.css";
import {useState} from "react";
import {CameraInteraction} from "../../components/commons/CameraInteraction.tsx";
import {VerIdentImageRecordingControls} from "../../components/predictions/controls/PredictionImageRecoringControls.tsx";

type Props={
    onNext: ()=>void
}

export function ReferenceImagesAcquisition({onNext}: Props){
    const [message, setMessage] = useState("");
    const [showImageRecordingControls, setShowImageRecordingControls] = useState(false);


    return (
        <div>
            <h1>Reference Image Acquisition</h1>
            <div className={styles.modelSection}>
                <div className={styles.model_training}>
                <p>Add reference images of people you want to do identification or verification for. Then you can verify or identify someone using an image.</p>
                <p>Note, that identification requires reference images of multiple people to make sense.</p>
                </div>
                <CameraInteraction message={message} setMessage={setMessage}>

                    {!showImageRecordingControls && (<div>
                        <button
                            type="button"
                            onClick={()=>setShowImageRecordingControls(true)}
                            className={`${styles.button} ${styles.primary}`}
                        >
                            Add new people or images
                        </button>
                    </div>)}
                    {!showImageRecordingControls && (<div>
                        <button
                            type="button"
                            onClick={onNext}
                            className={`${styles.button} ${styles.primary}`}
                        >
                            → To Prediction
                        </button>
                    </div>)}

                    {showImageRecordingControls  && (
                        <div>
                            <VerIdentImageRecordingControls/>
                            <button
                                type="button"
                                className={`${styles.button} ${styles.secondary}`}
                                onClick={()=> setShowImageRecordingControls(false)}
                            >
                                Close
                            </button>
                        </div>
                    )}

                </CameraInteraction>

            </div>
        </div>


    )

}