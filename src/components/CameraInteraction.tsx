import type { ReactNode} from "react";


import { getCameraStreamUrl } from "../api/modelApi"


type Props  = {
    children: ReactNode;
    message: string
    setMessage:  React.Dispatch<React.SetStateAction<string>>;
}

export function CameraInteraction({children, message, setMessage}:Props) {

    return (
        <section>
            <img
                src={getCameraStreamUrl()}
                alt="Live camera"
                width={250}
                height={250}
                style={{
                    display: "block",
                    objectFit: "cover",
                    marginBottom: 16,
                }}
                onLoad={() => {
                    console.log("Camera stream loaded");
                }}
                onError={(event) => {
                    console.error(
                        "Camera stream failed:",
                        getCameraStreamUrl(),
                        event,
                    );
                    setMessage("Camera stream could not be loaded");
                }}
            />
            {children}
            {message && <p>{message}</p>}
        </section>
    );
}