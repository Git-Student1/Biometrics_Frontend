import { useModels } from "../hooks/useModels";
import ListGroup from "./ListGroup";




export default function ModelsList() {
    const { models, isLoading, error } = useModels();
    const handleModelSelection = (model:str)=>{
        console.log(model)
    }

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
        <ListGroup title="Models" items={models} handleClick={handleModelSelection}></ListGroup>
    )
}
