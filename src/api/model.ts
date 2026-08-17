import {backendApi} from "./client";


interface ModelsResponse {
    models: string[];
}





// --------------------------------   model infos ----------------------------

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
        "/model/selectModel",
        {
            model_name:model
        }
    )
    return response.data.success
}

// -------------------------------- model training -----------------------

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

type TrainingStatus = {
    isTraining : boolean
    isAborting : boolean
}

export async function fetchTrainingStatus() {
    const response = await backendApi.get<TrainingStatus>("/model/training/status")
    return response.data;
}

