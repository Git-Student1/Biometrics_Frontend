import { CameraInteraction } from "./CameraInteraction"
import { doVerIdent } from "../api/modelApi"
import { useCallback } from "react"

export function VerIdent(){

    const prep = useCallback(async (): Promise<void> => {
        await doVerIdent();
    }, []);

    return <CameraInteraction preparation={prep}></CameraInteraction>
}