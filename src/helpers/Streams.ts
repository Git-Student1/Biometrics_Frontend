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

    const onValueRef = useRef(onValue);
    const onErrorRef = useRef(onError);
    const onCompletedRef = useRef(onCompleted);


    useEffect(() => {
        onValueRef.current = onValue;
    }, [onValue]);

    useEffect(() => {
        onErrorRef.current = onError;
    }, [onError]);

    useEffect(() => {
        onCompletedRef.current = onCompleted;
    }, [onCompleted]);



    const stop = () => {
        eventSourceRef.current?.close();
        eventSourceRef.current = null;
        setIsActive(false);
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
                onCompletedRef.current()
                stop()
            }
            else
                onValueRef.current(event.data);
        };

        eventSource.onerror = (error) => {
            onErrorRef.current?.(error);

            stop()
        };
        setIsActive(true);
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
