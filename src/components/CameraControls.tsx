import {type Dispatch, type ReactNode, type SetStateAction, useCallback, useEffect, useState} from "react";
import {fetchPeopleForVerification} from "../api/modelApi.ts";
import axios from "axios";

/**
* - addNewPerson: when function is given
*/
export type Props = {
    children?: ReactNode;
    buttonText:string
    setMessage: Dispatch<SetStateAction<string>>;
    onPersonSelect: (person: string) => void;
    alwaysShowPeople: boolean;
    addNewPerson?: (()=>Promise<void>);
    isProcessing:boolean,
    setIsProcessing:Dispatch<SetStateAction<boolean>>;
}

export function CameraControls({children, buttonText, setMessage, onPersonSelect, alwaysShowPeople, addNewPerson, isProcessing, setIsProcessing}: Props) {

    const [selectedPersonId, setSelectedPersonId] = useState("");
    const [showPersonSelection, setShowPersonSelection] = useState(false);

    const [people, setPeople] = useState<string[]>([])

    const newPersonKey = "newPerson"

    // @ts-ignore
    const showPeople = useCallback(async () => {
        setIsProcessing(true);
        setMessage("");
        try {
            const {people} = await fetchPeopleForVerification()
            if (addNewPerson !== undefined)
                people.push(newPersonKey)
            setPeople(people)


            setMessage("Select a Person")
            setShowPersonSelection(true);
        } catch (error) {
            setMessage(getErrorMessage(error));
        } finally {
            setIsProcessing(false);
        }
    }, [addNewPerson, setMessage])


    useEffect(() => {
        if (alwaysShowPeople) {
            void showPeople();
        }
    }, [alwaysShowPeople, showPeople]);

    const confirmSelection = useCallback(async () => {
        if (!selectedPersonId) {
            setMessage("Select a person first.");
            return;
        }
        setIsProcessing(true);
        setMessage("");
        try {
            if (selectedPersonId=== newPersonKey)
                if (addNewPerson)
                    await addNewPerson();
                else throw Error("Adding a person is not available.")
            else
                onPersonSelect(selectedPersonId)
        } catch (error) {
            setMessage(getErrorMessage(error));
        } finally {
            setIsProcessing(false);
        }
    }, [selectedPersonId]);

    const getErrorMessage = (error: unknown): string => {
        if (axios.isAxiosError(error)) {
            const detail = error.response?.data?.detail;

            return typeof detail === "string"
                ? detail
                : error.message;
        }

        return error instanceof Error
            ? error.message
            : "Camera action failed";
    };

    return (
        <>
            <div style={{ display: "flex", gap: 8 }}>

                {children}


                <button
                    type="button"
                    disabled={isProcessing}
                    onClick={showPeople}
                >
                    {buttonText}
                </button>

            </div>

            {(showPersonSelection || alwaysShowPeople) && (
                <div style={{ marginTop: 16 }}>
                    <label htmlFor="person">
                        Person
                    </label>

                    <select
                        id="select-person"
                        value={selectedPersonId}
                        disabled={isProcessing}
                        onChange={(event) =>
                            setSelectedPersonId(event.target.value)
                        }
                    >
                        <option value="">Select a person</option>
                        {

                        }
                        {people.map((person) => (
                            <option key={person}>
                                {person}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        disabled={isProcessing || !selectedPersonId}
                        onClick={() =>  confirmSelection()}
                    >
                        {buttonText}
                    </button>

                    <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => {
                            setShowPersonSelection(false);
                            setSelectedPersonId("");
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </>)

}