import axios from "axios";


interface ModelsResponse {
    models: string[];
}

const baseURL ="http://127.0.0.1:8000/"


export async function fetchModels(): Promise<string[]> {
    const response = await axios.get<ModelsResponse>(
        baseURL+"models",
        {
            timeout: 5000,
        }
    );

    return response.data.models;
}

interface ModelLoadingResponse{
    success:boolean
}

export async function selectModel(model:str){
    const response = await axios.post<ModelLoadingResponse>(
        baseURL+"selectModel",
        {
            model_name:model
        }
    )
    return response.data.success
}


//export async function loadModel():...