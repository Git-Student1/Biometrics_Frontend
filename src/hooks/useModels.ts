import { useEffect, useState } from "react";
import { fetchModels, type Model } from "../api/modelApi";

export function useModels() {
    const [models, setModels] = useState<Model[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadModels = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const data = await fetchModels();

                if (isMounted) {
                    setModels(data);
                }
            } catch (error) {
                console.error(error);

                if (isMounted) {
                    setError("Could not load models");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadModels();

        return () => {
            isMounted = false;
        };
    }, []);

    return {
        models,
        isLoading,
        error,
    };
}