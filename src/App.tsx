import './App.css'
import ModelList from "./components/ModelsList"
import { VerIdent } from "./components/VerIdent"
import {PosImageRecording} from "./components/PosImageRecording.tsx";


function App() {

    return (
        <>
            <ModelList />
            <PosImageRecording/>
            <VerIdent/>
        </>
)
}

export default App
