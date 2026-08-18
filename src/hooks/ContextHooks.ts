import {useContext} from "react";
import {
    PredictionFunctionalityContext,
    PredictionStateContext
} from "../components/predictions/VerIdent.tsx";

export function usePredictionStateContext() {
    const context = useContext(PredictionStateContext);

    if (context === null) {
        throw new Error(
            "contextHooks must be used inside PredictionMessagesContext.Provider"
        );
    }
    return context;
}

export function usePredictionFunctionalityContext() {
    const context = useContext(PredictionFunctionalityContext);

    if (context === null) {
        throw new Error(
            "contextHooks must be used inside PredictionMessagesContext.Provider"
        );
    }
    return context;
}