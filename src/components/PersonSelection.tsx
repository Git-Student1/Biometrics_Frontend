import { useCallback, useEffect, useState} from "react";
import axios from "axios";
import styles from "../Styles/Styles.module.css";
import {AddPerson} from "./AddPerson.tsx";



export type ButtonProp = {
    text: string;
    func: (person: string) => Promise<void>;
}

/**
 * - addNewPerson: when function for how to create a newPerson on the backend is given, creates a new selectable: newPerson
 */
export type Props = {
    buttonProps: ButtonProp[];
    onPersonSelect: (person: string) => void;
    addNewPerson?: ((person:string)=>Promise<void>);
    onClose?:()=>void;
    fetchPeopleFn:()=>Promise<string[]>
}
/**
 * buttonProps -  creates a button for every ButtonProp
 */
export function PersonSelection({buttonProps, onPersonSelect, addNewPerson, onClose, fetchPeopleFn}: Props) {

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [selectedPersonId, setSelectedPersonId] = useState("");

    const [people, setPeople] = useState<string[]>([])
    const [isAddingNewPerson, setIsAddingNewPerson] = useState(false);

    const newPersonKey = "newPerson"

    // @ts-ignore
    const loadPeople = useCallback(async () => {
        setErrorMessage("");
        try {
            const people = await fetchPeopleFn()
            if (addNewPerson !== undefined)
                people.push(newPersonKey)
            setPeople(people)

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


    const onPersonAdd = async (person:string) => {
        if(!addNewPerson)
            throw Error("Adding a Person is not permitted for this element. Internal logic error.");
        await addNewPerson(person)
        setIsAddingNewPerson(false)

    }


    const onPersenSelectionChange = (person:string) => {
        setSelectedPersonId(person)

        if(person === newPersonKey)
            if (addNewPerson)
                setIsAddingNewPerson(true);
            else throw Error("Adding a person is not available.")

        else if (person)
            onPersonSelect(person)
    }

    return (
        <>
            <div style={{ display: "flex", gap: 8 }}>


                {!isAddingNewPerson &&(<div style={{ marginTop: 16 }}>

                    <select
                        id="select-person"
                        value={selectedPersonId}
                        onFocus={() => void loadPeople()}
                        onChange={(event) => {
                            const person = event.target.value
                            onPersenSelectionChange(person)
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
                            className={`${styles.button} ${styles.primary}`}
                        >
                            {buttonProp.text}
                        </button>
                    ))}

                    { onClose && (<button
                        type="button"
                        onClick={() => {
                            setSelectedPersonId("");
                            onClose()
                        }}
                        className={`${styles.button} ${styles.secondary}`}
                    >
                            Close
                    </button>
                        )}
                </div>)}
                {isAddingNewPerson && (<AddPerson onPersonAdd={onPersonAdd} onClose={()=>setIsAddingNewPerson(false)}/>)}

                {(errorMessage && <p color={"red"}>{errorMessage}</p>)}
            </div>
        </>
    )

}