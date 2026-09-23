import styles from "../../../Styles/Styles.module.css";

import {
    usePredictionFunctionalityContext,
    usePredictionStateContext
} from "../../../hooks/ContextHooks.ts";



export type Props = {
    disableButtons: boolean;
    onVerify: ()=>void
}




export function PredictionBaseMenu({ disableButtons, onVerify}:Props) {
    const state = usePredictionStateContext()
    const predicitonFunctionality = usePredictionFunctionalityContext()


    return (
        <div>


            <div>
                <button
                    type="button"
                    disabled={disableButtons || state.state==="processing" }
                    onClick={predicitonFunctionality.startIdentification}
                    className={`${styles.button} ${styles.primary}`}
                >
                    Identification
                </button>

                <button
                    type="button"
                    disabled={disableButtons || state.state==="processing"}
                    onClick={onVerify}
                    className={`${styles.button} ${styles.primary}`}
                >
                    Verification
                </button>

            </div>
        </div>
        )
}