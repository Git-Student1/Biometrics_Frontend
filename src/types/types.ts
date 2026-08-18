import type {PersonEval} from "../api/camera.ts";

export type UpdatePredictionMessages = {
    add: (res: PersonEval) => void
    updateProgress: (person: string, progress: number) => void
}

type EvaluationProgress = {
    person: string;
    progress: number;
};

type ActivePredictionState = {
    personEvaluations: PersonEval[];
    progress: EvaluationProgress | null;
};

type backendIdle = "idle"
type backenProcessing = "processing"





export type PredictionState =
    | {
    mode: "idle_clean";
    state: backendIdle;
}
    | ActivePredictionState & {
    mode: "idle_show_verified_person";
    state: backendIdle;
    person: string;
    isThatPerson: boolean;
}
    | ActivePredictionState & {
    mode: "idle_show_identified_person";
    state: backendIdle;
    identifiedPerson: string;
}
    | ActivePredictionState & {
    mode: "identification";
    state: backenProcessing;
}
    | ActivePredictionState & {
    mode: "verification";
    person: string;
    state: backenProcessing;
};


export type PredictionContextType = {
    state: PredictionState;

    // Identification
    startIdentification: () => void;
    setIdentifiedPerson: (person: string) => void;

    //Verification
    startVerification: (person: string) => void;
    setIsThatPerson: (result: boolean) => void;

    //Both
    addPersonEvaluation: (evaluation: PersonEval) => void;
    updateProgress: (person: string, progress: number) => void;
    clear: () => void;
};


export type PredictionAction =
    | { type: "START_IDENTIFICATION" }
    | { type: "START_VERIFICATION"; person: string }
    | { type: "UPDATE_PROGRESS"; person: string; progress: number }
    | { type: "ADD_PERSON_EVAL"; evaluation: PersonEval }
    | { type: "IDENTIFIED"; person: string }
    | { type: "VERIFIED"; isThatPerson: boolean }
    | { type: "CLEAR" };