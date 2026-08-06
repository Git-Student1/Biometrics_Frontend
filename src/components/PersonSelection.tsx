import {useCallback, useEffect, useState} from "react";
import {fetchPeopleForVerification} from "../api/modelApi.ts";
import axios from "axios";



export type ButtonProp = {
    text: string;
    func: (person: string) => void;
}

/**
 * - addNewPerson: when function for how to create a newPerson on the backend is given, creates a new selectable: newPerson
 */
export type Props = {
    buttonProps: ButtonProp[];
    onPersonSelect: (person: string) => void;
    addNewPerson?: (()=>Promise<void>);
    onClose:()=>void;
}
/**
 * buttonProps -  creates a button for every ButtonProp
 */
export function PersonSelection({buttonProps, onPersonSelect, addNewPerson, onClose}: Props) {

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [selectedPersonId, setSelectedPersonId] = useState("");

    const [people, setPeople] = useState<string[]>([])

    const newPersonKey = "newPerson"

    // @ts-ignore
    const loadPeople = useCallback(async () => {
        setErrorMessage("");
        try {
            const {people} = await fetchPeopleForVerification()
            if (addNewPerson !== undefined)
                people.push(newPersonKey)
            setPeople(people)


            setErrorMessage("Select a Person")
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        }
    }, [addNewPerson, setErrorMessage])


    useEffect(() => {

    }, [loadPeople]);

    const confirmSelection = useCallback(async (onPersonConfirm:(person: string) => void) => {
        if (!selectedPersonId) {
            setErrorMessage("Select a person first.");
            return;
        }
        setErrorMessage("");
        try {
            if (selectedPersonId=== newPersonKey)
                if (addNewPerson)
                    await addNewPerson();
                else throw Error("Adding a person is not available.")
            else
                onPersonConfirm(selectedPersonId)
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
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


                <div style={{ marginTop: 16 }}>

                    <select
                        id="select-person"
                        value={selectedPersonId}
                        onFocus={() => void loadPeople()}
                        onChange={(event) => {
                            const person = event.target.value
                            setSelectedPersonId(person)
                            if (person)
                                onPersonSelect(person)
                            }
                        }
                    >
                        <option value="">Select a person</option>
                        {

                        }
                        {people.map((person) => (
                            <option key={person} value={person}>
                                {person}
                            </option>
                        ))}
                    </select>

                    {buttonProps.map((buttonProp) => (
                        <button
                            key={buttonProp.text}
                            type="button"
                            disabled={!selectedPersonId}
                            onClick={
                                () => confirmSelection(
                                    ()=>buttonProp.func(selectedPersonId)
                                )
                            }
                        >
                            {buttonProp.text}
                        </button>
                    ))}

                    <button
                        type="button"
                        onClick={() => {
                            setSelectedPersonId("");
                            onClose()
                        }}
                    >
                        Close
                    </button>
                </div>

                {(errorMessage && <p color={"red"}>{errorMessage}</p>)}
            </div>
        </>
    )

}