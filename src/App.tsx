import './App.css'
import { useState } from "react";
import {ModelAquisition} from "./pages/ModelAquisition.tsx";
import {Prediction} from "./pages/Prediction.tsx";


function App() {
    const [loadedModel, setLoadedModel] =
        useState<string | null>(null);


    if (loadedModel === null){
        return <ModelAquisition setLoadedModel={setLoadedModel}/>
    }
    return <Prediction setLoadedModel={setLoadedModel}/>





}
export default App;