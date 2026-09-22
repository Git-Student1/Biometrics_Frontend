import {useState} from "react";
import {ModelAquisition} from "./ModelAquisition.tsx";
import {Prediction} from "./Prediction.tsx";

export function FaceRecognitionProgram() {
    const [loadedModel, setLoadedModel] =
        useState<string | null>(null);
    if (loadedModel === null){
        return <ModelAquisition setLoadedModel={setLoadedModel}/>
    }
    return <Prediction setLoadedModel={setLoadedModel}/>
}