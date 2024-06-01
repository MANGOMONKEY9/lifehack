import React from "react";
import ReactDOM from 'react-dom/client';
import App from "./components/App";
import {BrowserRouter as Router} from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <div style={{width: "100%", height: "100%"}}>
        <Router>
            <App />
        </Router>
    </div>
);