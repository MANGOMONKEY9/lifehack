import React from "react";
import style from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    // navigation set up
    const navigate = useNavigate();
    const handleNavigate = (path) => {
        navigate(path);
    };
    
    return(
        <div style={{display: "flex", flexDirection: "row", backgroundColor: "white", justifyContent: "center"}}>
        <div className={style.logo}>
            <img alt="police logo" src="https://www.police.gov.sg/-/media/Spf/Settings/Singapore-Police-Force-Crest.ashx" style={{height: "100%"}}/>
        </div>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", backgroundColor: "white"}}>
            <div className={style.container}>
            <div className={style.button_container}>
                <button className={style.button} onClick={() => handleNavigate("/webpage")}>
                    Dashboard
                </button>
            </div>
            </div>
            <div className={style.container}>
            <div className={style.button_container}>
                <button className={style.button} onClick={() => handleNavigate("/webpage/update")}>
                    Update
                </button>
            </div>
            </div>
        </div>
        </div>
    )
}