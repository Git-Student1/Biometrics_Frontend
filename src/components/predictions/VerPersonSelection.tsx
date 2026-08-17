import {type ButtonProp, PersonSelection} from "../commons/PersonSelection.tsx";
import {fetchPeopleQualifyingForVerification} from "../../api/people.ts";
import {VerIdentImageCount} from "./VerIdentImageCount.tsx";
import {doVerification} from "../../api/camera.ts";
import {useState} from "react";



export type Props = {
    setMessage: (text:string)=>void
    onStartVerify:()=>void;
    onEndVerify:()=>void;
    onClose:()=>void;
}

export function VerPersonSelection({setMessage, onEndVerify, onStartVerify, onClose}:Props) {
    const [selectedPerson, setSelectedPerson] = useState<string>("");

    const buttonProps: ButtonProp[] = [
        {
            text: "Verify",
            func: async (person:string) =>{
                onStartVerify()
                await runVerification(person)
                onEndVerify()
            }

        }
    ]

    const runVerification = async (selectedPersonId:string) => {
        if (!selectedPersonId) {
            setMessage("Select a person first.");
             return;
        }
        const response = await doVerification(selectedPersonId);
        setMessage(`
        Result: ${response.result}, 
        Details: ${response.details}`);
    }


    return (
        <>
            <div>
                <PersonSelection
                    fetchPeopleFn={fetchPeopleQualifyingForVerification}
                    onPersonSelect={setSelectedPerson}
                    buttonProps= {buttonProps}
                    onClose={onClose}

                />
            </div>
            <div>
                {selectedPerson!=="" && (
                    <VerIdentImageCount recordingPerson={selectedPerson}/>
                )}
            </div>
        </>
    )
}