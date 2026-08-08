import './App.css'
import ModelList from "./components/ModelsList"
import { VerIdent } from "./components/VerIdent"
import {PosImageRecording} from "./components/PosImageRecording.tsx";
import {ModelTraining} from "./components/ModelTraining.tsx";
import {useState} from "react";
import styles from "./Styles/Styles.module.css";


function App() {
    const [loadedModel, setLoadedModel] =
        useState<string | null>(null);

    if (loadedModel === null) {
        return (
            <div className="setup-view">
                <h1>Choices: Train a new model or load a model</h1>

                <section className={"model-section"} >
                    <h2>Train a model</h2>
                    <h3 className={styles.noBottomSpace}>1. Add positive/anchor images</h3>
                    <p className={`${styles.text} ${styles.hint} ${styles.subtitle} `}>(can be skipped if there are already sufficient images)</p>
                    <PosImageRecording />
                    <h3>2. Start model training</h3>
                    <ModelTraining />
                </section >
                <section className={"model-section"}>
                    <h2>Load a model</h2>
                    <ModelList
                        onModelLoaded={setLoadedModel}
                    />
                </section>
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