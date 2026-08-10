import {getCameraRecordingStatus} from "../api/camera.ts";
import {getErrorMessage} from "./Errors.ts";

export const checkIsRecording = async () =>{
    try{
        const response = await getCameraRecordingStatus();
        if (response.recording!== undefined && typeof (response.recording)==="boolean")
            return response.recording;
    } catch (error) {
        console.error(getErrorMessage(error, "Checking recording status failed"));
    }
    return false;
}
