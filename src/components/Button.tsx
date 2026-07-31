import React from 'react';
import App from "../App";

interface Props{
    children:string
    onClick?:()=>void
}
const Button =  ({ children, onClick }:Props)=>{
    const text = children
    return <button
        className={"btn btn-primary"}
        onClick={onClick}>
        {children}
    </button>
}

export default Button