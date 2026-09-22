import styles from "../Styles/Styles.module.css";
import {VerIdent} from "../components/predictions/VerIdent.tsx";


type Props = {
    setLoadedModel: (model:string)=>void
}

export function Prediction({setLoadedModel}: Props) {
    return (
        <div >
            <h1>Do Verification / Identification</h1>
            <div className={styles.modelSection}>
                <button
                    type="button"
                    onClick={() => setLoadedModel(null)}
                    className={`${styles.button} ${styles.secondary}`}
                >
                    Back to model selection
                </button>

                <section className={styles.model_training}>
                    <p>Add reference images of people you want to do identification or verification for. Then you can verify or identify someone using an image.</p>
                    <p>Note, that identification requires multiple people to make sense.</p>
                    <VerIdent />
                </section>
            </div>
        </div>
    );
}