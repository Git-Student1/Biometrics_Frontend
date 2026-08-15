import './App.css'
import ModelList from "./components/model/ModelsList.tsx"
import { VerIdent } from "./components/predictions/VerIdent.tsx"
import {PosImageRecording} from "./components/trainingImgRecording/PosImageRecording.tsx";
import {ModelTraining} from "./components/model/ModelTraining.tsx";
import {useState} from "react";
import styles from "./Styles/Styles.module.css";


function App() {
    const [loadedModel, setLoadedModel] =
        useState<string | null>(null);

    if (loadedModel === null) {
        return (
            <div className="setup-view">
                <h1>Choices: Train a new model or load a model</h1>

                <details className={"model-section"} >
                    <summary className={`${styles.sectionSummary} `} >
                        <h2>Train new model</h2>
                        <span className={styles.arrow}>▼</span>
                    </summary>
                    <div className={styles.model_training}>
                           <h3 className={styles.noBottomSpace}>1. Add positive/anchor images</h3>
                           <p className={`${styles.text} ${styles.hint} ${styles.subtitle} `}>(can be skipped if there are already sufficient images)</p>

                            <PosImageRecording />
                        </div>
                    <div className={styles.model_training}>
                        <h3>2. Start model training</h3>
                        <ModelTraining />
                    </div>

                </details>
                <details className={"model-section"}>
                    <summary className={styles.sectionSummary}>
                        <h2>Load existing model</h2>
                        <span className={styles.arrow}>▼</span>
                    </summary>
                    <ModelList
                        onModelLoaded={setLoadedModel}
                    />
                </details>
            </div>
        );
    }

    return (
        <div className="verification-view">
            <h1>Do Verification / Identification</h1>
            <button
                type="button"
                onClick={() => setLoadedModel(null)}
                className={`${styles.button} ${styles.secondary}`}
            >
                Back to model selection
            </button>

            <section className={"model-section"}>
                <VerIdent />
            </section>
        </div>
    );
}
export default App;