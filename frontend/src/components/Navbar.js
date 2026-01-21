import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Vacations
                </Link>

                <div className="navbar-menu">
                    {!isAuthenticated() ? (
                        <>
                            <Link to="/login" className="navbar-link">Login</Link>
                            <Link to="/register" className="navbar-link navbar-link-primary">Register</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/vacations" className="navbar-link">Vacations</Link>
                            {isAdmin() && (
                                <>
                                    <Link to="/admin" className="navbar-link">Manage</Link>
                                    <Link to="/reports" className="navbar-link">Reports</Link>
                                </>
                            )}
                            <span className="navbar-user">
                                Hello, {user?.firstName} {user?.lastName}
                            </span>
                            <button onClick={handleLogout} className="navbar-logout">
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
