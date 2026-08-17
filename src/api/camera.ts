// ----------------------------------------------------  camera -------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------
import {backendApi} from "./client.ts";

export function getCameraStreamUrl(): string {
    return `${backendApi.defaults.baseURL}/camera/stream`;
}

export type CameraStatusResponse = {
    active: boolean
    error: string
};

export async function getCameraStatus() {
    const response = await backendApi.get<CameraStatusResponse>("/camera/status")
    return response.data;
}
export type SuccessResponse = {
    success:boolean
    details:string
}


export type VerIdentResponse = {
    result: string
    details: string
};
//-------------------------------------------- identification /  verification -----------------------------------------
//---------------------------------------------------------------------------------------------------------------------
export async function doIdentification(): Promise<SuccessResponse> {
    const response = await backendApi.post<SuccessResponse>(
        "/camera/identify",
    );
    return response.data;
}

export function getIdentificationMessageStream(): string {
    return `${backendApi.defaults.baseURL}/camera/identify/messages`;
}

export type IdentifyPersonEval = {
    type: "person_eval";
    person: string;
    matches: boolean;
    match_ratio: number;
    mean_similarity: number;
    max_similarity: number;
};

export type IdentifyResult = {
    type: "result";
    person: string;
};


export type IdentifyMessage =
    | IdentifyPersonEval
    | IdentifyResult;



export async function doVerification(person: string
): Promise<VerIdentResponse> {
    const response = await backendApi.post<VerIdentResponse>(
        "/camera/verify",
        {
            person: person
        }
    );
    return response.data;
}

export async function startRecordingVerIdent(person: string) {
    await backendApi.post(
        "/camera/startRecordingPred",
        {person: person}
    );
}

export function getCameraRecordingStatusStream(): string {
    return `${backendApi.defaults.baseURL}/camera/recordingstatusStream/`;
}

export type RecordingStatus = {
    recording: boolean
}

export async function getCameraRecordingStatus(): Promise<RecordingStatus> {
    const response = await backendApi.get<RecordingStatus>(
        "/camera/recordingstatus/"
    );
    return response.data;
}

export async function startRecordingPos(person: string) {
    await backendApi.post(
        "/camera/startRecordingPos",
        {person: person}
    );
}

export async function startRecordingAnc(person: string) {
    await backendApi.post(
        "/camera/startRecordingAnc",
        {person: person}
    );
}

export async function stopRecording() {
    await backendApi.post(
        "/camera/stopRecording",
    );
}