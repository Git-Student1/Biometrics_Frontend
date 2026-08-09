import {useRef} from "react";
import styles from "../Styles/Styles.module.css"


export type Props = {
    onPersonAdd: (person:string) => Promise<void>
    onClose: ()=>void;
}

export function AddPerson({ onPersonAdd, onClose }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick =  () => {
        const value = inputRef.current?.value ?? "";
        void onPersonAdd(value);
        console.log(value);
    };

    return (
        <div style={{ display: "flex", gap: 8 }}>
            <input
                ref={inputRef}
                type="text"
                placeholder="Enter person name"
            />

            <button
                type="button"
                onClick={handleClick}
            >
                Add Person
            </button>
            <button
            type="button"
            onClick={onClose}
            className={`${styles.button} ${styles.secondary}`} >
                Close
            </button>
        </div>
    );
}