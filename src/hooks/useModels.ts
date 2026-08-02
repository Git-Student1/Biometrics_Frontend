import { useEffect, useState } from "react";
import { fetchModels, selectModel, type Model } from "../api/modelApi";
import { useQuery, useMutation } from "@tanstack/react-query";



export function useModels() {
    const {
        data: models = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["models"],
        queryFn: fetchModels,
    });

    return {
        models,
        isLoading,
        error: error ? "Could not load models" : null,
    };
}
