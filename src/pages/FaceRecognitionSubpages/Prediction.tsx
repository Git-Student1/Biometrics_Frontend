import styles from "../../Styles/Styles.module.css";
import {PredictionComponent} from "../../components/predictions/PredictionComponent.tsx";


type Props = {
    onGoBack: ()=>void
}

export function Prediction({onGoBack}: Props) {
    return (
        <div >
            <h1>Do Verification / Identification</h1>
            <div className={styles.modelSection}>

                <section className={styles.model_training}>
                    <h3>Identification</h3>
                    <p>Finding out who the person in the image is (using the reference images).</p>
                </section>
                <section className={styles.model_training}>
                    <h3>Verification</h3>
                    <p>Finding out if the person in the image is the person you select (using the reference images). </p>
                </section>
                    <PredictionComponent />

            </div>
        </div>
    );
}