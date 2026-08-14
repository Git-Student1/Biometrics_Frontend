import { useState } from "react"
import styles from "../../Styles/ListStyle.module.css"

interface Props{
    title:string,
    items:string[],
    handleClick:(item:string) => void

}



const ListGroup = ({title, items, handleClick}:Props)=>{
    const [selectedIndex, setSelected] = useState<Number>(-1)
    if(selectedIndex===1)
        return

    return (
        <ul className={styles.list_group}>
            {items.map((item, index)=>(
                <li key={item}
                    className={  selectedIndex===index ? `${styles.list_group_item} ${styles.active}`:`${styles.list_group_item}`}
                    onClick={()=>{
                        setSelected(index)
                        handleClick(item)
                    }
                }>{item}</li>
            ))}
        </ul>)

}

export default ListGroup