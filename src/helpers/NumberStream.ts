import {useEffect} from "react";

export type NumberStreamOptions = {
    url: string | null;
    onValue: (value: number) => void;
    onError?: (error: Event) => void;
};

export function useNumberStream({
                                    url,
                                    onValue,
                                    onError,
                                }: NumberStreamOptions): void {
    useEffect(() => {
        if (!url) {
            return;
        }

        const eventSource = new EventSource(url);

        eventSource.onmessage = (event: MessageEvent<string>) => {

            const value = Number(event.data);
            if (Number.isFinite(value)) {
                onValue(value);
            }
        };

        eventSource.onerror = (error) => {
            onError?.(error);
        };

        return () => {
            eventSource.close();
        };
    }, [url, onValue, onError]);
}