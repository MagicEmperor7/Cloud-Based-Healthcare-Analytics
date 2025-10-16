import React, { useState, useEffect } from 'react';
import AssessmentForm from './assessmentForm';
import './app.css';
import Navbar from './navbar';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Panel from './panel';
import Profile from './profile';
import Results from './results';

const AppRoutes = ({ user, setUser, logoutUser, isDoctor, welcomeMsg, showWelcome, setShowWelcome }) => {
    return (
        <Routes>
            <Route path="/" element={
                <>
                    {showWelcome && (
                        <div className={`welcome-popup ${showWelcome ? 'show' : ''}`} onClick={() => setShowWelcome(false)}>
                            {welcomeMsg}
                        </div>  
                    )}
                    <Navbar user={user} setUser={setUser} logoutUser={logoutUser} isDoctor={isDoctor} />
                    <AssessmentForm />
                </>
            } />
            <Route path="/panel" element={isDoctor ? <Panel/> : <Navigate to="/" replace />} />
            <Route path="/profile" element={
                user ? (
                    <>
                        <Navbar user={user} setUser={setUser} logoutUser={logoutUser} isDoctor={isDoctor} />
                        <Profile isDoctor={isDoctor} />
                    </>
                ) : (
                    <Navigate to="/" replace />
                )
            } />
            <Route path="/results" element={
                <>
                    <Navbar user={user} setUser={setUser} logoutUser={logoutUser} isDoctor={isDoctor} />
                    {user && !isDoctor ? (
                        <Results />
                    ) : !user ? (
                        <div className="error-container">
                            <h2>Login Required</h2>
                            <p>Please login to view your test results.</p>
                        </div>
                    ) : (
                        <Navigate to="/" replace />
                    )}
                </>
            } />
        </Routes>
    );
};

const App = () => {    
    const [user, setUserState] = useState(null);
    const [isDoctor, setIsDoctor] = useState(false);
    const [welcomeMsg, setWelcomeMsg] = useState("");
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('username');
        const storedDoctor = localStorage.getItem('isDoctor');
        if (storedUser) {
            setUserState(storedUser);
            setIsDoctor(storedDoctor === 'true');
        }
    }, []);

    const setUser = (username, doctor = false) => {
        setUserState(username);
        setIsDoctor(doctor);
        if (username) {
            localStorage.setItem('username', username);
            localStorage.setItem('isDoctor', doctor);
            setWelcomeMsg(`Welcome ${username}`);
            setShowWelcome(true);
            setTimeout(() => setShowWelcome(false), 3000);
        } else {
            localStorage.removeItem('username');
            localStorage.removeItem('isDoctor');
        }
    };

    const logoutUser = () => {
        setUser(null);
        setIsDoctor(false);
    };

    return (
        <Router>
            <AppRoutes
                user={user}
                setUser={setUser}
                logoutUser={logoutUser}
                isDoctor={isDoctor}
                welcomeMsg={welcomeMsg}
                showWelcome={showWelcome}
                setShowWelcome={setShowWelcome}
            />
        </Router>
    );
};

export default App;