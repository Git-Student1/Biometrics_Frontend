import { useModels } from "../hooks/useModels";
import ListGroup from "./ListGroup";
import { selectModel } from "../api/modelApi"



export default function ModelsList() {
    const { models, isLoading, error } = useModels();
    const handleModelSelection = (model:string) => {
        try {
            selectModel(model).then(
                //popup that it was loaded
            ).catch(
                //popup that it failed
            )
            console.log(model)
        } catch(e) {
            console.log(e)
        }

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
