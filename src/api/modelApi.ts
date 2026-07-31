import axios from "axios";


interface ModelsResponse {
    models: string[];
}

export async function fetchModels(): Promise<Model[]> {
    const response = await axios.get<ModelsResponse>(
        "http://127.0.0.1:8000/models",
        {
            timeout: 5000,
        }
    );

    return response.data.models;
}

//export async function loadModel():...