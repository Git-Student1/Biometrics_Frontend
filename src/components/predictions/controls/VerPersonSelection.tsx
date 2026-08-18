import {type ButtonProp, PersonSelection} from "../../commons/PersonSelection.tsx";
import {fetchPeopleQualifyingForVerification} from "../../../api/people.ts";
import {VerIdentImageCount} from "../visualisation/VerIdentImageCount.tsx";
import {useState} from "react";
import {usePredictionFunctionalityContext} from "../../../hooks/ContextHooks.ts";



export type Props = {
    onStartVerify:()=>void;
    onClose:()=>void;
}

export function VerPersonSelection({ onStartVerify, onClose}:Props) {
    const predicitonFunctionality = usePredictionFunctionalityContext()

    const [selectedPerson, setSelectedPerson] = useState<string>("");
    const buttonProps: ButtonProp[] = [
        {
            text: "Verify",
            func: async (person:string) =>{
                onStartVerify()
                predicitonFunctionality.startVerification(person)
            }
        }
    ]


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