import {createContext, useCallback, useState} from "react";
import { CameraInteraction } from "../commons/CameraInteraction.tsx";
import { VerIdentControls } from "./controls/VerIdentControls.tsx";
import { PredictionResults } from "./visualisation/PredictionResults.tsx";
import {doIdentification, doVerification, type PersonEval} from "../../api/camera.ts";
import type {PredictionContextType, PredictionState, UpdatePredictionMessages} from "../../types/types.ts";
import {getErrorMessage} from "../../helpers/Errors.ts";
import {useStartableStringStream} from "../../helpers/Streams.ts";
import {identStreamProps, verifyStreamProps} from "../../helpers/Prediction/PredictionStreamProps.ts";




export const PredictionStateContext = createContext<PredictionState|null>(null);
export const PredictionFunctionalityContext = createContext<PredictionContextType|null>(null);


export function VerIdent() {
    
    const [message, setMessage] = useState("");
    const [state, setState] = useState<PredictionState>({
        mode: "idle_clean",
        state: "idle",
    });


    const updatePredictionMessages:UpdatePredictionMessages = {
        add:  useCallback((res: PersonEval) => {
            setState(current => {
                if (current.state === "idle") {
                    return current;
                }
                return {
                    ...current,
                    personEvaluations:[...current.personEvaluations, res],
                    progress:null
                }
            })
        },[]),
        updateProgress:useCallback((person:string, progress:number)=>{
            setState(current => {
                if (current.mode === "idle_clean") {
                    return current;
                }
                return {
                    ...current,
                    progress:{
                        person:person,
                        progress:progress
                    }
                }
            })
        },[]),
    }






    const startIdentification = useCallback(async () => {
        clear()

        try {
            const { success, details } = await doIdentification();
            if (success) {
                startIdentificationStream()
                setState({

                    personEvaluations: [],
                    progress: null,
                    mode: "identification",
                    state:"processing"
                });
            }
        } catch (error) {
            console.error(getErrorMessage(error, "Camera action failed"));
        }
    }, []);

    const startVerification = useCallback(async (person: string) => {
        clear()
        if (!person) {
            setMessage("Select a person first.");
            return;
        }
        const { success, details } =  await doVerification(person);
        console.log("success", success);
        if (success){
            startVerificationnStream()
            setState({
                    mode: "verification",
                    state:"processing",
                    person:person,
                    personEvaluations:[],
                    progress:null,
                });

        }
    }, []);

    const setIdentifiedPerson = useCallback((person: string) => {
        setState(current => {
            if (current.mode !== "identification") {
                return current;
            }

            return {
                mode: "idle_show_identified_person",
                state:"idle",
                identifiedPerson: person,
                personEvaluations:current.personEvaluations,
                progress:null,
            };
        });
    }, []);

    const setIsThatPerson = useCallback((isThatPerson: boolean) => {
        setState(current => {
            if (current.mode !== "verification") {
                return current;
            }

            return {
                ...current,
                mode: "idle_show_verified_person",
                state:"idle",
                isThatPerson: isThatPerson,
                progress:null
            };
        });
    }, []);

    const clear = useCallback(() => {
        setState({
            mode: "idle_clean",
            state:"idle"
        });
    }, []);


    const {
        startMessageStream: startIdentificationStream,
        isActive: identIsActive,
    } = useStartableStringStream(identStreamProps(updatePredictionMessages, setIdentifiedPerson, ()=>{}))
    const {
        startMessageStream:startVerificationnStream,
        isActive: verifyIsActive
    } = useStartableStringStream(verifyStreamProps(updatePredictionMessages, setIsThatPerson, ()=>{}))




    return (
        <PredictionStateContext.Provider value={state}>
            <PredictionFunctionalityContext.Provider value={{
                state:state,
                addPersonEvaluation: updatePredictionMessages.add,
                updateProgress:updatePredictionMessages.updateProgress,
                clear:clear,
                startVerification:startVerification,
                setIsThatPerson:setIsThatPerson,
                startIdentification:startIdentification,
                setIdentifiedPerson:setIdentifiedPerson,
            }}>

                <CameraInteraction message={message} setMessage={setMessage}>

                    <VerIdentControls />

                    {state.mode !=="idle_clean" &&(<>
                        {(state.mode ==="verification" || state.mode ==="idle_show_verified_person") && (
                            <>
                                {(state.personEvaluations.length!==0) && (
                                <PredictionResults items={state.personEvaluations} identifiedPerson={null}/>)}

                                {state.mode ==="idle_show_verified_person" && (
                                    <p>Person {state.isThatPerson?"was confirmed as":"is not"} {state.person} </p>
                                )}
                            </>)}

                        {(state.mode ==="identification" || state.mode ==="idle_show_identified_person") && (
                            <>
                                {(state.mode ==="identification") &&
                                    (<PredictionResults items={state.personEvaluations} identifiedPerson={null}/>)}

                                {(state.mode ==="idle_show_identified_person") &&
                                    (<PredictionResults items={state.personEvaluations} identifiedPerson={state.identifiedPerson}/>)}
                                {(state.mode ==="idle_show_identified_person")  && (
                                    <p> Identified Person: {state.identifiedPerson}</p>
                                )}
                            </>)}


                        {(state.state === "processing"&& state.progress?.person) && (<p> Person {state.progress.person} analyzing ... {(100*Number(state.progress.progress)).toFixed(3)}% </p>)}

                    </>)}

                </CameraInteraction>
            </PredictionFunctionalityContext.Provider>
        </PredictionStateContext.Provider>

    );
}