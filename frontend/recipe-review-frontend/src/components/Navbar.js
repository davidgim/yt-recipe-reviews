import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logOut } from '../features/auth/authSlice';
import '../styles/components.css';

const Navbar = () => {
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logOut());
        navigate('/');
    };

    return (
        <nav className="nav-container">
            <div className="nav-content">
                <Link to="/" className="nav-logo">
                    Recipe Review
                </Link>
                <div className="nav-buttons">
                    {!currentUser ? (
                        <>
                            <Link to="/login" className="nav-button">
                                Login
                            </Link>
                            <Link to="/register" className="nav-button nav-button-primary">
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <>
                            <span className="nav-welcome">
                                Welcome, {currentUser.username}!
                            </span>
                            <button onClick={handleLogout} className="nav-button nav-button-primary">
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 