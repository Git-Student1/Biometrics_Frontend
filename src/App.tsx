import './App.css'
import ModelList from "./components/ModelsList"
import { VerIdent } from "./components/VerIdent"
import {PosImageRecording} from "./components/PosImageRecording.tsx";
import {ModelTraining} from "./components/ModelTraining.tsx";


function App() {

    return (
        <>
            <ModelTraining/>
            <ModelList />
            <PosImageRecording/>
            <VerIdent/>
        </>
)
}

export default App
