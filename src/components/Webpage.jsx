import Navbar from "./Navbar";
import styles from "./Webpage.module.css";
import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

export default function Webpage() {
    // dropdown for police station selection
    const [selectedStation, setSelectedStaton] = useState("All")
    const handleStationChange = (e) => {
        setSelectedStaton(e.target.value)
    }
    // Threats
    const [threatLocations, setThreatLocations] = useState([]);

    // plotting of peak crime spots
    const citymap = {
        jurong: { center: { lat: 1.3368, lng: 103.6942 }, name: "Jurong" },
        cck: { center: { lat: 1.3840, lng: 103.7470 }, name: "Choa Chu Kang" },
        bishan: { center: { lat: 1.3526, lng: 103.8352 }, name: "Bishan" },
        hougang: { center: { lat: 1.3612, lng: 103.8863 }, name: "Hougang" },
        bb: { center: { lat: 1.3590, lng: 103.7637 }, name: "Bukit Batok" },
        bj: { center: { lat: 1.3774, lng: 103.7719 }, name: "Bukit Panjang" },
        tampines: { center: { lat: 1.3496, lng: 103.9568 }, name: "Tampines" },
        yishun: { center: { lat: 1.4304, lng: 103.8354 }, name: "Yishun" },
        mp: { center: { lat: 1.3020, lng: 103.8971 }, name: "Marine Parade" },
        sengkang: { center: { lat: 1.3868, lng: 103.8914 }, name: "Sengkang" },
        bm: { center: { lat: 1.2819, lng: 103.8239 }, name: "Bukit Merah" },
        bt: { center: { lat: 1.3294, lng: 103.8021 }, name: "Bukit Timah" },
        pasirris: { center: { lat: 1.3721, lng: 103.9474 }, name: "Pasir Ris" },
        punggol: { center: { lat: 1.3984, lng: 103.9072 }, name: "Punggol" },
        sembawang: { center: { lat: 1.4491, lng: 103.8185 }, name: "Sembawang" },
        woodlands: { center: { lat: 1.4382, lng: 103.7890 }, name: "Woodlands" },
        aljunied: { center: { lat: 1.3164, lng: 103.8829 }, name: "Aljunied" },
        bedok: { center: { lat: 1.3236, lng: 103.9273 }, name: "Bedok" },
        kampongglam: { center: { lat: 1.3016, lng: 103.8623 }, name: "Kampong Glam" },
        mbs: { center: { lat: 1.2838, lng: 103.8591 }, name: "Marina Bay" },
        orchard: { center: { lat: 1.3048, lng: 103.8318 }, name: "Orchard" }
    };
    
    const circlesRef = useRef({});


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

    // setting active patrols
    const [activePatrols, setActivePatrols] = useState({});
    const [totalActivePatrols, setTotalActivePatrols] = useState(0)
    // setting incident reports
    const [incidentReports, setIncidentReports] = useState([])
    useEffect(() => {
        //fetching frm database
        const fetchActivePatrols = async () => {
            try{ 
                const response = await fetch("http://localhost:4000/getActivePatrols",{
                credentials: 'include'}
            );
                const data = await response.json();
                // Transform data to a dictionary
                const patrolsData = data.reduce((acc, patrol) => {
                    acc[patrol.location] = patrol.active_patrols;
                    return acc;
                }, {});

                setActivePatrols(patrolsData);
                // Calculate total patrols
                const total = Object.values(patrolsData).reduce((sum, count) => sum + count, 0);
                setTotalActivePatrols(total);
            } catch (err) {
                console.error("Error fetching active patrols", err)
            }};

        // fetching threat locations
        const fetchThreatLocations = async () => {
            try {
                const response = await fetch("http://localhost:4000/getActiveThreats",{
                    credentials: 'include'
                });
                const data = await response.json();
                setThreatLocations(data);
            } catch (err) {
                console.error("Error fetching threat locations", err);
            }
        };
        // fetching report
        const fetchIncidentReports = async () => {
            try {
                const response = await fetch("http://localhost:4000/getReports", {
                    credentials: 'include'
                });
                const data = await response.json();
                // format data
                const formattedData = data.map(report => ({
                    ...report,
                    report: `${report.report} [${report.created_time}]`
                }))
                setIncidentReports(formattedData);
            } catch (err) {
                console.error(err)
            }
        }
        fetchThreatLocations();   
        fetchActivePatrols();
        fetchIncidentReports();
    }, [])

     // Display map function
     const google = window.google;
     const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: "AIzaSyB_tVl5Cz9KZF3jQ9f1NJkIdzJ1YSRviYM"
    })
    const [map, setMap] = React.useState(null)
    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds({
            lat: 1.3245,
            lng:103.8572
        });
        const trafficLayer = new google.maps.TrafficLayer();
        map.fitBounds(bounds)
        trafficLayer.setMap(map)
        Object.keys(citymap).forEach((key) => {
            const city = citymap[key];
            const circle = new window.google.maps.Circle({
                strokeColor: "#FF0000",
                strokeOpacity: 0,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0,
                center: city.center,
                map,
                radius: 900
            });
            circlesRef.current[key] = circle;
          });
    }, [])
    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])
    // making circles invisible 
    useEffect(() => {
        console.log("Updating circle visibility based on threat locations");
        console.log("Threat Locations:", threatLocations);
        Object.keys(circlesRef.current).forEach((key) => {
            const circle = circlesRef.current[key];
            if (circle) {
                const isVisible = threatLocations.some((location) => location.location_name === citymap[key].name);
                console.log(`Setting circle visibility for ${key} to ${isVisible ? "visible" : "hidden"}`);
                circle.setOptions({ fillOpacity: isVisible ? 0.35 : 0 });
                circle.setOptions({ strokeOpacity: isVisible ? 0.8 : 0 })
            } 
        });
    }, [threatLocations]);

    const patrolCount = selectedStation === "All" ? totalActivePatrols : activePatrols[selectedStation] || 0;


    return(
        <div style={{width: "100%", height: "100%", backgroundColor: "#1c335f", overflow: "hidden", flexDirection: "row"}}>
                <Navbar />
            <div style={{justifyContent: "flex-start", display: "flex", height: "100%", padding: "50px", marginLeft: "100px", flexDirection: "row"}}>
            <div style={{justifyContent: "flex-start", display: "flex", height: "100%", padding: "20px",marginRight: "100px",marginTop: "40px", flexDirection: "column"}}>
                <div className={styles.container}>
                    <div className={styles.table_sum}>
                    <div className={styles.active_patrols}>
                        Active Patrols
                        <div style={{fontSize: "15px"}}>
                            <select value={selectedStation} onChange={handleStationChange}>
                                <option value="All">All</option>
                                {policeCentres.map((centre, index) => (
                                    <option key={{index}} value={centre}>{centre}</option>
                                )
                                )}
                            </select>
                        </div>
                        <div className={styles.patrol_number}>
                            {patrolCount}
                        </div>
                    </div>
                    <div className={styles.recent_incidents}>
                        Threat Locations
                        {threatLocations.map((location, index) => (
                                <div key={index} className={styles.location}>
                                    {location.location_name}
                                </div>
                            ))}
                    </div>
                    </div>
                </div>
                <div className={styles.activity_log}>
                    <div className={styles.report_container}>
                    {incidentReports.map((report, index) => (
                        <div key={index} className={styles.report}>
                            {report.report}
                        </div>
                    ))}
                    </div>
                </div>
                </div>
                <div style={{height: "500px", width: "800px", marginTop: "100px"}}>
                    {isLoaded ? (
                <GoogleMap 
                    mapContainerStyle={{height: "100%", width: "100%"}}
                    zoom={(12)}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                ></GoogleMap>
                    ): (
                        <div style={{fontFamily: "Lato SemiBold, Arial, Helvetica, sans-serif", fontSize: "1500"}}>Loading...</div>
                    )
                    }
                </div>
            </div>
        </div>
    )
}