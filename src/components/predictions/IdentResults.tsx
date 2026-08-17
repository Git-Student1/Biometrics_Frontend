import styles from "../../Styles/Table.module.css"
import type { IdentifyPersonEval } from "../../api/camera.ts";

interface Props{
    items:IdentifyPersonEval[],
    identifiedPerson:string
}



const IdentResults = ({ items, identifiedPerson }:Props)=>{


    const percentString = (number:Number)=>{
        return `${(100*Number(number)).toFixed(0)} %`
    }


    return (<>
                <table>
                    <thead>
                        <tr>
                            <td className={styles.first_cell}>Name</td>
                            <td>Matches</td>
                            <td>Match Ratio</td>
                            <td>Mean Similarity</td>
                            <td>Max Similarity</td>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index)=>(
                                <tr key={index} className={`${styles.table_row} ${identifiedPerson===item.person?styles.active: ""} ${index%2===1?styles.alternate_color: ""}`}>
                                    <td className={styles.first_cell}>{item.person}</td>
                                    <td>{item.matches}</td>
                                    <td>{percentString(item.match_ratio)}</td>
                                    <td>{percentString(item.mean_similarity)}</td>
                                    <td>{percentString(item.max_similarity)}</td>
                                </tr>
                        ))}
                    </tbody>
                </table>
            </>)

}

export default IdentResults