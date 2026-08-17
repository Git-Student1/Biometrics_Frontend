import styles from "../../Styles/ListStyle.module.css"
import type { IdentifyPersonEval } from "../../api/camera.ts";

interface Props{
    items:IdentifyPersonEval[],
    identifiedPerson:string
}



const IdenResultListGroup = ({ items, identifiedPerson }:Props)=>{


    return (
        <ul className={styles.list_group}>
            {items.map((item, index)=>(
                <li key={item.person}
                    className={`${styles.list_group_item}`}
                    >{`person ${item.person} - matches: ${item.matches} `}</li>
            ))}
        </ul>)

}

export default IdenResultListGroup