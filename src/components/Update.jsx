import Navbar from "./Navbar";
import styles from "./Update.module.css";
import React, { useState } from "react";

export default function Update() {
    // dropdown for police station selection
    const [selectedStation, setSelectedStation] = useState("Ang Mo Kio North NPC");
    const [selectedArea, setSelectedArea] = useState("");
    const [textFieldValue, setTextFieldValue] = useState("");
    const handleStationChange = (e) => {
        setSelectedStation(e.target.value);
    }
    const handleAreaChange = (e) => {
        setSelectedArea(e.target.value);
    }
    const handleTextFieldChange = (e) => {
        setTextFieldValue(e.target.value);
    }

    // function to start patrol
    const startPatrol = async () => {
        try {
            const response = await fetch("http://localhost:4000/startPatrol", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({location: selectedStation}),
                credentials: "include"
            });
            if (response.ok) {
                alert("Patrol started successfully")
            } else {
                alert("Failed to start. Try Again")
            }
        } catch (err) {
            console.error(err)
        }
    }

    // function to end patrol
    const endPatrol = async () => {
        try {
            const response = await fetch("http://localhost:4000/endPatrol", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({location: selectedStation}),
                credentials: "include"
            });
            if (response.ok) {
                alert("Patrol ended successfully")
            } else {
                alert("Failed to end. Try Again")
            }
        } catch (err) {
            console.error(err)
        }
        }

    // function to submit report
    const submitIncident = async () => {
        try {
            const response = await fetch('http://localhost:4000/submitReport', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ location: selectedArea, report: textFieldValue }),
                credentials: "include"
            });
            if (response.ok) {
                alert("Report Completed")
                setTextFieldValue("")
            } else {
                console.error("Failed to submit incident");
            }
        } catch (err) {
            console.error("Error submitting incident:", err);
        }
    };
    const policeCentres = [
        "Ang Mo Kio North NPC",
        "Ang Mo Kio South NPC",
        "Bedok North NPC",
        "Bedok South NPC",
        "Bishan NPC",
        "Bukit Batok NPC",
        "Bukit Merah East NPC",
        "Bukit Merah West NPC",
        "Bukit Panjang NPC",
        "Bukit Timah NPC",
        "Changi NPC",
        "Choa Chu Kang NPC",
        "Clementi NPC",
        "Geylang NPC",
        "Hougang NPC",
        "Jurong East NPC",
        "Jurong West NPC",
        "Kampong Java NPC",
        "Marine Parade NPC",
        "Nanyang NPC",
        "Orchard NPC",
        "Pasir Ris NPC",
        "Queenstown NPC",
        "Rochor NPC",
        "Sembawang NPC",
        "Serangoon NPC",
        "Tampines NPC",
        "Toa Payoh NPC",
        "Woodlands NPC",
        "Yishun North NPC",
        "Yishun South NPC"
    ];

    const towns = [
        "Jurong",
        "Choa Chu Kang",
        "Bishan",
        "Hougang",
        "Bukit Batok",
        "Bukit Panjang",
        "Tampines",
        "Yishun",
        "Marine Parade",
        "Sengkang",
        "Bukit Merah",
        "Bukit Timah",
        "Pasir Ris",
        "Punggol",
        "Sembawang",
        "Woodlands",
        "Aljunied",
        "Bedok",
        "Kampong Glam",
        "Marina Bay",
        "Orchard"
    ];

    return (
        <div style={{width: "100%", height: "100%", backgroundColor: "#1c335f", overflow: "hidden"}}>
            <Navbar />
            <div className={styles.main}>
                <div className={styles.container}>
                <div className={styles.patrol}>
                    Patrol
                    <div className={styles.instruction}>
                        Select your NPC
                    </div>
                <select value={selectedStation} onChange={handleStationChange}>
                    {policeCentres.map((centre, index) => (
                        <option key={{index}} value={centre}>{centre}</option>
                    )
                    )};
                </select>
                </div>
                <div className={styles.button_container}>
                    <button className={styles.button} onClick={startPatrol}>
                        Start
                    </button>
                    <button className={styles.button} onClick={endPatrol}>
                        End
                    </button>
                </div>
                </div>
                <div className={styles.container}>
                    <div className={styles.patrol}>
                        Incident Summary
                        <div className={styles.instruction}>
                            Select your area
                        </div>
                        <select value={selectedArea} onChange={handleAreaChange}>
                    {towns.map((towns, index) => (
                        <option key={{index}} value={towns}>{towns}</option>
                    )
                    )};
                </select>
                <textarea 
                    type="text"
                    value={textFieldValue}
                    onChange={handleTextFieldChange}
                    className={styles.text_field}
                    placeholder="Describe the action and location"
                />
                <button className={styles.button} onClick={submitIncident}>
                        Submit
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}