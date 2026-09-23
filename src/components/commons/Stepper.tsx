
import styles from "../../Styles/Stepper.module.css"

export type Step = {
    label: string;
    page:React.ReactNode
};

type StepperProps = {
    steps: Step[];
    currentStep: number;
    setCurrentStep: (currentStep: number) => void;
};

export function Stepper({steps, currentStep, setCurrentStep}: StepperProps) {
    function isPrevStep(step: number) {
        return step<currentStep
    }



    return (<ol className={styles.stepper}>
        Face Recognition:
        {steps.map((step, index) => {
            return (
                <li>
                    <span
                        className={`${styles.step} ${currentStep === index? styles.selected : ''} ${isPrevStep(index)? styles.completed : ''}`}
                        onClick={() => {
                            if (isPrevStep(index)) setCurrentStep(index);
                        }}
                    >
                        {index+1}: {step.label}
                    </span>
                </li>)
        })}
    </ol>)


}