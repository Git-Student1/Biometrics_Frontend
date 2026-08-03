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

export async function selectModel(model:str){
    const response = await backendApi.post<ModelLoadingResponse>(
        "/selectModel",
        {
            model_name:model
        }
    )
    return response.data.success
}

export type CameraKeyResponse = {
    status: string;
    key: string;
};

export async function pressCameraKey(
    key: string,
): Promise<CameraKeyResponse> {
    const response = await backendApi.post<CameraKeyResponse>(
        "/camera/key",
        { key },
    );

    return response.data;
}

export async function doVerIdent(): Promise{
    const response = await backendApi.post(
        "/camera/doVerIdent"
    );

    return response.data;
}

export function getCameraStreamUrl(): string {
    return `${backendApi.defaults.baseURL}/camera/stream`;
}


//export async function loadModel():...