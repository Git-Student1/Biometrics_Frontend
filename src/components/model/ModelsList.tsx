import { useModels } from "../../hooks/useModels.ts";
import SelectableListGroup from "../commons/SelectableListGroup.tsx";
import { selectModel } from "../../api/model.ts"
import {useCallback} from "react";



export type Props = {
    onModelLoaded:(model:string)=>void
}

export default function ModelsList( {onModelLoaded}: Props ) {
    const { models, isLoading, error } = useModels();
    const handleModelSelection = useCallback((model:string) => {
        try {
            selectModel(model).then(
                ()=>onModelLoaded(model)
            )
            console.log(model)
        } catch(e) {

            console.log(e)
        }

    },[])

    if (isLoading) {
        return <p>Loading models...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (models.length === 0) {
        return <p>No models found.</p>;
    }

    return (
        <SelectableListGroup title="Models" items={models} handleClick={handleModelSelection}></SelectableListGroup>
    )
}
