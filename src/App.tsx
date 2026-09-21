import './App.css'
import ModelList from "./components/model/ModelsList.tsx"
import { VerIdent } from "./components/predictions/VerIdent.tsx"
import { PosImageRecording } from "./components/trainingImgRecording/PosImageRecording.tsx";
import { ModelTraining } from "./components/model/ModelTraining.tsx";
import { useLayoutEffect, useRef, useState } from "react";
import styles from "./Styles/Styles.module.css";


function App() {
    const [loadedModel, setLoadedModel] =
        useState<string | null>(null);



    const leftRef = useRef<HTMLDivElement | null>(null);
    const rightRef = useRef<HTMLDivElement | null>(null);
    const dividerRef = useRef<HTMLDivElement | null>(null);

    const [orPosition, setOrPosition] = useState(0);
    const [orVisible, setOrVisible] = useState(true);

    useLayoutEffect(() => {
        const left = leftRef.current;
        const right = rightRef.current;
        const divider = dividerRef.current;

        if (!left || !right || !divider) return;

        const update = () => {
            const leftRect = left.getBoundingClientRect();
            const rightRect = right.getBoundingClientRect();
            const dividerRect = divider.getBoundingClientRect();

            // Area that is:
            // 1. inside the left box
            // 2. inside the right box
            // 3. visible in the viewport
            const visibleTop = Math.max(
                leftRect.top,
                rightRect.top,
                0
            );

            const visibleBottom = Math.min(
                leftRect.bottom,
                rightRect.bottom,
                window.innerHeight
            );

            // No part of both boxes is currently visible
            if (visibleBottom <= visibleTop) {
                setOrVisible(false);
                return;
            }

            setOrVisible(true);

            // Center of the currently visible common area
            const viewportCenter =
                (visibleTop + visibleBottom) / 2;

            // Convert viewport coordinates to coordinates
            // relative to the divider
            const positionInsideDivider =
                viewportCenter - dividerRect.top;

            setOrPosition(positionInsideDivider);
        };

        update();

        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);

        const observer = new ResizeObserver(update);
        observer.observe(left);
        observer.observe(right);

        return () => {
            window.removeEventListener("scroll", update);
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

                    <div
                        ref={dividerRef}
                        className={styles.divider}
                    >
                        {orVisible && (
                            <span
                                className={styles.dividerText}
                                style={{ top: orPosition }}
                            >
                                OR
                            </span>
                        )}
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