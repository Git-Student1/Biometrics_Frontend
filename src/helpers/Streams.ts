import {useCallback, useEffect, useRef, useState} from "react";

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

export type StringStreamOptions = {
    url: string;
    onValue: (value: string) => void;
    onError?: (error: Event) => void;
};

type StartableStream = {
    startMessageStream: () => void;
    stopMessageStream: () => void;
    isActive: boolean;
};

export function useStartableStringStream({
                                             url,
                                             onValue,
                                             onError,
                                         }: StringStreamOptions): StartableStream {
    const eventSourceRef = useRef<EventSource | null>(null);
    const [isActive, setIsActive] = useState(false);

    const stop = useCallback(() => {
        eventSourceRef.current?.close();
        eventSourceRef.current = null;
        setIsActive(false);
    }, []);

    const start = () => {
        setIsActive(true);
        // Prevent multiple simultaneous connections
        if (eventSourceRef.current) {
            return;
        }


        const eventSource = new EventSource(url);

        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event: MessageEvent<string>) => {
            console.log(event.data)
            onValue(event.data);
            if(event.data==="done")
                eventSource.close();
        };

        eventSource.onerror = (error) => {
            onError?.(error);
        };
    }

    // Close the connection if the component is unmounted
    useEffect(() => {
        return () => {
            stop()
        };
    }, []);

    return {
        startMessageStream:start,
        stopMessageStream:stop,
        isActive,
    };
}
