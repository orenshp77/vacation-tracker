import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Vacations from './pages/Vacations';
import AdminVacations from './pages/AdminVacations';
import AddVacation from './pages/AddVacation';
import EditVacation from './pages/EditVacation';
import Reports from './pages/Reports';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />

                            {/* Protected Routes - Users */}
                            <Route
                                path="/vacations"
                                element={
                                    <ProtectedRoute>
                                        <Vacations />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Protected Routes - Admin Only */}
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute adminOnly>
                                        <AdminVacations />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/add"
                                element={
                                    <ProtectedRoute adminOnly>
                                        <AddVacation />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/edit/:id"
                                element={
                                    <ProtectedRoute adminOnly>
                                        <EditVacation />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/reports"
                                element={
                                    <ProtectedRoute adminOnly>
                                        <Reports />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Default Routes */}
                            <Route path="/" element={<Navigate to="/login" replace />} />
                            <Route path="*" element={<Navigate to="/login" replace />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
