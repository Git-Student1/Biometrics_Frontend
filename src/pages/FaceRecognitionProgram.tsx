import {useState} from "react";
import {ModelAquisition} from "./FaceRecognitionSubpages/ModelAquisition.tsx";
import {Prediction} from "./FaceRecognitionSubpages/Prediction.tsx";
import {type Step, Stepper,} from "../components/commons/Stepper.tsx";
import {ReferenceImagesAcquisition} from "./FaceRecognitionSubpages/ReferenceImagesAcquisition.tsx";

export function FaceRecognitionProgram() {
    const [loadedModel, setLoadedModel] =
        useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const steps:Step[] = [
        {label:"Model acquisition", page: <ModelAquisition setLoadedModel={model=>{setLoadedModel(model);toNextStep()}}/>},
        {label:"Reference Image Acquisition", page: <ReferenceImagesAcquisition onNext={toNextStep}/>},
        {label:"Prediction", page: <Prediction onGoBack={toPrevStep}/>}
    ]
    function toNextStep() {
        if (currentStep===steps.length-1) throw Error("Already at highest step")
        setCurrentStep(currentStep=>currentStep + 1);
    }

    function toPrevStep() {
        if (currentStep===0) throw Error("Already at lowest step")
        setCurrentStep(currentStep=>currentStep - 1);
    }

    return (
    <div>
        <Stepper currentStep={currentStep} steps={steps} setCurrentStep={setCurrentStep}/>
        {steps[currentStep].page}
    </div>)

}