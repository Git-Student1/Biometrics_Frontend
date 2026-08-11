import { useEffect, useRef, useState} from "react";

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
    onCompleted: () => void;
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
                                             onCompleted
                                         }: StringStreamOptions): StartableStream {
    const eventSourceRef = useRef<EventSource | null>(null);
    const [isActive, setIsActive] = useState(false);


    useEffect(()=>{
        if (eventSourceRef.current)
            setIsActive(true)
        else
            setIsActive(false)
    },[eventSourceRef.current])

    const stop = () => {
        eventSourceRef.current?.close();
        eventSourceRef.current = null;
    }

    const start = () => {
        // Prevent multiple simultaneous connections
        if (eventSourceRef.current) {
            return;
        }


        const eventSource = new EventSource(url);

        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event: MessageEvent<string>) => {
            console.log(event.data)
            if(event.data==="done") {
                console.log("done")
                onCompleted()
                stop()
            }
            else
                onValue(event.data);
        };

        eventSource.onerror = (error) => {
            onError?.(error);

            stop()
        };
    }

    useEffect(() => {
        return ()=>{
            stop()
        }
    }, []);


    return {
        startMessageStream:start,
        stopMessageStream:stop,
        isActive,
    };
}
