
import styles from "../../Styles/Stepper.module.css"

export type Step = {
    label: string;
    page:React.ReactNode
};

type StepperProps = {
    steps: Step[];
    currentStep: number;
};

export function Stepper({steps, currentStep}: StepperProps) {
    return (<ol className={styles.stepper}>
        {steps.map((step, index) => {
            return (
                <li
                    className={`${styles.step} ${currentStep === index? styles.selected : ''} ${currentStep > index? styles.completed : ''}`}
                >{index+1}: {step.label}</li>)
        })}
    </ol>)


}