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

export type VerIdentResponse = {
    result:string
    details:string
};

export async function doIdentification(
): Promise<VerIdentResponse>{
    const response = await backendApi.get<CameraKeyResponse>(
        "/camera/identify",
    );
    return response.data;
}

export async function doVerification(
): Promise<VerIdentResponse> {
    const response = await backendApi.get<CameraKeyResponse>(
        "/camera/verify",
    );

    return response.data.result, response.data.details;
}



export function getCameraStreamUrl(): string {
    return `${backendApi.defaults.baseURL}/camera/stream`;
}


//export async function loadModel():...