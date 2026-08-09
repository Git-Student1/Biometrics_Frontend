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

// -------------------------------------------- model -----------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

export async function fetchModels(): Promise<string[]> {
    const response = await backendApi.get<ModelsResponse>(
        "/model/models",
        {
            timeout: 5000,
        }
    );

    return response.data.models;
}

interface SuccessResponse{
    success:boolean
    details:string
}

export async function selectModel(model:string){
    const response = await backendApi.post<SuccessResponse>(
        "/model/    selectModel",
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

// ---------------------- model training -----------------------

export function getModelTrainingMessagesStream(): string {
    return `${backendApi.defaults.baseURL}/model/training/messages`;
}

export async function startModelTraining(){
    const response = await backendApi.post<SuccessResponse>(
        "/model/training/start",
    )
    return response.data
}

export async function stopModelTraining(){
    const response = await backendApi.post<SuccessResponse>(
        "/model/training/stop",
    )
    return response.data
}

// ----------------------------------------------------  camera -------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------
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

//-------------------------------------------- identification /  verification -----------------------------------------
//---------------------------------------------------------------------------------------------------------------------
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

export async function fetchPeopleQualifyingForVerification(){
    const response = await backendApi.get<PeopleForVerify>(
        "/people/prediction/qualifying"
    );
    return response.data.people
}

export async function fetchAllVerIdentPeople(){
    const response = await backendApi.get<PeopleForVerify>(
        "/people/prediction/all"
    );
    return response.data.people
}

export async function addVerIdentPerson(person:string){
    await backendApi.post(
        "/camera/addVerIdentPerson",
        {person:person}
    )
}

export function getNumberImgVerIdentStreamUrl(person: string): string {
    return `${backendApi.defaults.baseURL}/camera/numberPredictionImgs/${encodeURIComponent(person)}`;
}


export async function startRecordingVerIdent(person: string){
    await backendApi.post(
            "/camera/startRecordingPred",
        {person:person}
    );
}


export type PeopleForVerify = {
    people:string[]
}


//-------------------------------------   Positives / Negatives Recording ---------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

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

export async function addTrainingPerson(person:string){
    await backendApi.post(
        "/camera/addTrainingPerson",
        {person:person}
    )
}

export async function fetchTrainingPeople(){
    const response = await backendApi.get<PeopleForVerify>(
        "/people/training"
    );
    return response.data.people
}



//export async function loadModel():...