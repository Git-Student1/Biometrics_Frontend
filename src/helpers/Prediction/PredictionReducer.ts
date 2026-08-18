import type {PredictionAction, PredictionState} from "../../types/types.ts";

export function predictionReducer(
    state: PredictionState,
    action: PredictionAction
): PredictionState {
    switch (action.type) {
        case "START_IDENTIFICATION":
            return {
                mode: "identification",
                personEvaluations: [],
                progress: null,
                identifiedPerson: null,
            };

        case "START_VERIFICATION":
            return {
                mode: "verification",
                personEvaluations: [],
                progress: null,
                person: action.person,
                isThatPerson: null,
            };

        case "UPDATE_PROGRESS":
            if (state.mode === "idle_clean") {
                return state;
            }

            return {
                ...state,
                progress: {
                    person: action.person,
                    progress: action.progress,
                },
            };

        case "ADD_PERSON_EVAL":
            if (state.mode === "idle_clean") {
                return state;
            }

            return {
                ...state,
                personEvaluations: [
                    ...state.personEvaluations,
                    action.evaluation,
                ],
                progress: null,
            };

        case "IDENTIFIED":
            if (state.mode !== "identification") {
                return state;
            }

            return {
                ...state,
                identifiedPerson: action.person,
            };

        case "VERIFIED":
            if (state.mode !== "verification") {
                return state;
            }

            return {
                ...state,
                isThatPerson: action.isThatPerson,
            };

        case "CLEAR":
            return {
                mode: "idle_clean",
            };
    }
}