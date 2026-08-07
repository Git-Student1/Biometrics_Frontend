import axios from "axios";


export function getErrorMessage (error: unknown, text:string): string  {
    if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;

        return typeof detail === "string"
            ? detail
            : error.message;
    }

    return error instanceof Error
        ? error.message
        : text;
};