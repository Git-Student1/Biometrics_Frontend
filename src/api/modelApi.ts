import axios from "axios";


interface ModelsResponse {
    models: string[];
}

const backendApi = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
});


export async function fetchModels(): Promise<string[]> {
    const response = await backendApi.get<ModelsResponse>(
        "/models",
        {
            timeout: 5000,
        }
    );

    return response.data.models;
}

interface ModelLoadingResponse{
    success:boolean
}

export async function selectModel(model:string){
    const response = await backendApi.post<ModelLoadingResponse>(
        "/selectModel",
        {
            model_name:model
        }
    )
    return response.data.success
}

export type VerIdentResponse = {
    result:string
    details:string
};

export async function doIdentification(
): Promise<VerIdentResponse>{
    const response = await backendApi.post<VerIdentResponse>(
        "/camera/identify",
    );
    return response.data;
}

export async function doVerification(person:string
): Promise<VerIdentResponse> {
    const response = await backendApi.post<VerIdentResponse>(
        "/camera/verify",
         {
            person:person
         }

    );
    return response.data;
}



export function getCameraStreamUrl(): string {
    return `${backendApi.defaults.baseURL}/camera/stream`;
}

export type CameraStatusResponse = {
    active:boolean
    error:string
};

export async function getCameraStatus() {
    const response = await backendApi.get<CameraStatusResponse>("/camera/status")
    return response.data;
}

export type PeopleForVerify = {
    people:string[]
}

export async function fetchPeopleForVerification(){
    const response = await backendApi.get<PeopleForVerify>(
        "/peopleForVerification"
    );
    return response.data
}

export function getNumberPosStreamUrl(person: string): string {
    return `${backendApi.defaults.baseURL}/camera/numberPositives/${encodeURIComponent(person)}`;
}
export function getNumberAncStreamUrl(person: string): string {
    return `${backendApi.defaults.baseURL}/camera/numberAnchors/${encodeURIComponent(person)}`;
}


export function getCameraRecordingStatusStream(): string {
    return `${backendApi.defaults.baseURL}/camera/recordingstatusStream/`;
}

export type RecordingStatus = {
    recording:boolean
}

export async function getCameraRecordingStatus(): Promise<RecordingStatus> {
    const response = await backendApi.get<RecordingStatus>(
        "/camera/recordingstatus/"
    );
    return response.data;
}


export async function startRecordingPos(person: string){
    await backendApi.post(
        "/camera/startRecordingPos",
        {person:person}
    );
}

export async function startRecordingAnc(person: string){
    await backendApi.post(
        "/camera/startRecordingAnc",
        {person:person}
    );
}

export async function stopRecording(){
    await backendApi.post(
        "/camera/stopRecording",
    );
}


//export async function loadModel():...