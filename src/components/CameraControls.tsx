import {type Dispatch, type ReactNode, type SetStateAction, useCallback, useEffect, useState} from "react";
import {fetchPeopleForVerification} from "../api/modelApi.ts";
import axios from "axios";
import {PersonSelection} from "./PersonSelection.tsx";

/**
* - addNewPerson: when function is given
*/
export type Props = {
    children?: ReactNode;
    buttonText:string
    setMessage: Dispatch<SetStateAction<string>>;
    onPersonSelect: (person: string) => void;
    alwaysShowPeople: boolean;
    addNewPerson?: (()=>Promise<void>);
    isProcessing:boolean,
    setIsProcessing:Dispatch<SetStateAction<boolean>>;
}

export function CameraControls({children, buttonText, setMessage, onPersonSelect, alwaysShowPeople, addNewPerson, isProcessing, setIsProcessing}: Props) {



    return (
        <>
            <div style={{ display: "flex", gap: 8 }}>

                {children}



            </div>

        </>)

}