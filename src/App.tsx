import './App.css'
import ModelList from "./components/model/ModelsList.tsx"
import { VerIdent } from "./components/predictions/VerIdent.tsx"
import {PosImageRecording} from "./components/trainingImgRecording/PosImageRecording.tsx";
import {ModelTraining} from "./components/model/ModelTraining.tsx";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import styles from "./Styles/Styles.module.css";


function App() {
    const [loadedModel, setLoadedModel] =
        useState<string | null>(null);



    const leftRef = useRef<HTMLDivElement | null>(null);
    const rightRef = useRef<HTMLDivElement | null>(null);

    const [orPosition, setOrPosition] = useState(0);

    useLayoutEffect(() => {
        if (loadedModel !== null) return;

        const left = leftRef.current;

        if (!left) return;

        const update = () => {
            const rect = left.getBoundingClientRect();

            const visibleHeight = Math.min(
                rect.height,
                window.innerHeight - rect.top
            );

            setOrPosition(visibleHeight / 2);
        };

        update();

        window.addEventListener("resize", update);

        const observer = new ResizeObserver(update);
        observer.observe(left);

        return () => {
            window.removeEventListener("resize", update);
            observer.disconnect();
        };
    }, [loadedModel]);


    if (loadedModel === null) {
        return (
            <div className={styles.centerDiv}>
                <h1>Choose model acquisition</h1>
                <div className={styles.modelSelectionChoices}>
                    <div ref={leftRef}  className={styles.modelSection} >
                        <h2>Train new model</h2>
                        <div className={styles.model_training}>
                               <h3 className={styles.noBottomSpace}>1. Add positive/anchor images</h3>
                               <p className={`${styles.text} ${styles.hint} ${styles.subtitle} `}>(can be skipped if there are already sufficient images)</p>

                                <PosImageRecording />
                            </div>
                        <div className={styles.model_training}>
                            <h3>2. Start model training</h3>
                            <ModelTraining />
                        </div>

                    </div>
                    <div className={styles.divider}>
                        <span
                        className={styles.dividerText}
                        style={{ top: orPosition }}
                        >
                            OR
                        </span>
                    </div>
                    <div ref={rightRef} className={styles.modelSection}>
                        <h2>Load existing model</h2>
                        <ModelList
                            onModelLoaded={setLoadedModel}
                        />
                    </div>
                </div>
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