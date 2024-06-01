import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Webpage from './Webpage';
import Update from './Update';

export default function App() {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        // Check if user is authenticated
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:4000/checkAuth', {
                    credentials: 'include'
                });
                const data = await response.json();
                console.log(data)
                setAuthenticated(data.isAuthenticated);
            } catch (err) {
                console.error('Error checking authentication', err);
                setAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        console.log("authenticated updated to:", authenticated);
    }, [authenticated]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Routes>
                <Route path="/" element={<Login setAuthenticated={setAuthenticated} />} />
                <Route path="/webpage" element={authenticated ? <Webpage /> : <Navigate to="/" />} />
                <Route path="/webpage/update" element={authenticated ? <Update /> : <Navigate to="/" />} />
            </Routes>
        </div>
    );
}