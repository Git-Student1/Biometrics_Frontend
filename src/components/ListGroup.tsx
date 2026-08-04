import { useState } from "react"

interface Props{
    title:string,
    items:string[],
    handleClick:(item:string) => void

}



const ListGroup = ({title, items, handleClick}:Props)=>{
    const [selectedIndex, setSelected] = useState(-1)

    return <>
        <h2>{title}</h2>
        <ul className="list-group">
            {items.map((item, index)=>(
                <li key={item}
                    className={selectedIndex===index? 'list-group-item active':'list-group-item'}
                    onClick={()=>{
                        setSelected(index)
                        handleClick(item)
                    }
                }>{item}</li>
            ))}
        </ul>
    </>
}

export default ListGroup