import { useState } from 'react'
import './App.css'
import  Button  from './components/Button'
import ModelList from "./components/ModelsList"
import { VerIdent } from "./components/VerIdent"


function App() {

    return (
        <>
            <ModelList />
            <VerIdent/>
        </>
)
}

export default App
