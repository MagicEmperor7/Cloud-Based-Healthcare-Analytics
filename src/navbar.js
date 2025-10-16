import React, { useState, useRef, useEffect } from "react";
import Login from "./login";
import Signup from "./signup";
import ChatBox from './chatBox';
import { useNavigate } from 'react-router-dom';

function Navbar({ user, setUser, logoutUser, isDoctor }) {
    const [loginPopup, setLoginPopup] = useState(false);
    const [signupPopup, setSignupPopup] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [chatPopup, setChatPopup] = useState(false);
    const [screenMode, setScreenMode]= useState(false);

    const menuRef = useRef(null);
    const navigate = useNavigate();

     useEffect(() => {
    if (screenMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [screenMode]);

  
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <nav className="navbar new-navbar">
            <div className="navbar-left" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                <img src="/logo.png" alt="Logo" className="navbar-logo-img" />
                <span className="navbar-appname">MindCheck</span>
            </div>
            <div className="navbar-center">
                <button className="nav-btn" onClick={() => navigate('/')}>Home</button>
                {!isDoctor && <button className="nav-btn" onClick={() => navigate('/results')}>My Results</button>}
                {isDoctor && <button className="nav-btn" onClick={() => navigate('/panel')}>Doctor Portal</button>}
                <button className="nav-btn" onClick={() => setChatPopup(prev => !prev)}> Talk With AI</button>
                {chatPopup && <ChatBox />}

            </div>
            <div className="navbar-right">
                <button className="nav-btn" onClick={() => setScreenMode(prev => !prev)}> 
                    {screenMode ? '🌙' : '☀️'} </button>

                {user ? (
                    <div className="user-menu-container">
                        <button className="profile-menu-btn" onClick={() => setMenuOpen(v => !v)}>
                            <span className="profile-avatar" role="img" aria-label="profile">👤</span>
                        </button>
                        {menuOpen && (
                            <div ref={menuRef} className="user-popup-menu">
                                <button className="view-profile-btn" onClick={() => { setMenuOpen(false); navigate('/profile'); }}>View Profile</button>
                                <div className="profile-username">{user}</div>
                                {isDoctor && <button className="panel-btn" onClick={() => { setMenuOpen(false); navigate('/panel'); }}>Panel</button>}
                                <button className="logout-btn" onClick={() => { logoutUser(); setMenuOpen(false); }}>Logout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <button className="login-btn" onClick={() => setLoginPopup(true)} >Login</button>
                        <button className="signup-btn" onClick={() => setSignupPopup(true)}>Sign Up</button>
                    </>
                )}
            </div>
            {!user && loginPopup && <Login onclose={() => setLoginPopup(false)} setUser={setUser} />}
            {!user && signupPopup && <Signup onclose={() => setSignupPopup(false)} setUser={setUser} />}
        </nav>
    );
}

export default Navbar;
