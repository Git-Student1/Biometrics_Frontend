
interface Props{
    title:string,
    items:string[],
    handleClick:(item:str) => void

}

const ListGroup = ({title, items, handleClick}:Props)=>{
    return <>
        <h2>{title}</h2>
        <ul className="list-group">
            {items.map((item)=>(
                <li onClick={()=>handleClick(item)}>{item}</li>
            ))}
        </ul>
    </>
}

export default ListGroup