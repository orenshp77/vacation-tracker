import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vacationsAPI } from '../services/api';
import VacationCard from '../components/VacationCard';
import './AdminVacations.css';

const AdminVacations = () => {
    const [vacations, setVacations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchVacations();
    }, []);

    const fetchVacations = async () => {
        try {
            setLoading(true);
            const response = await vacationsAPI.getAll();
            setVacations(response.data);
        } catch (err) {
            setError('Failed to load vacations');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/edit/${id}`);
    };

    const handleDeleteClick = (id) => {
        setDeleteConfirm(id);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm) return;

        try {
            await vacationsAPI.delete(deleteConfirm);
            setVacations(prev => prev.filter(v => v.id !== deleteConfirm));
            setDeleteConfirm(null);
        } catch (err) {
            console.error('Failed to delete:', err);
            alert('Failed to delete vacation');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm(null);
    };

    if (loading) {
        return <div className="loading">Loading vacations...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Manage Vacations</h1>
                <button
                    className="add-vacation-btn"
                    onClick={() => navigate('/admin/add')}
                >
                    + Add Vacation
                </button>
            </div>

            <div className="vacations-grid">
                {vacations.map(vacation => (
                    <VacationCard
                        key={vacation.id}
                        vacation={vacation}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                    />
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to delete this vacation?</p>
                        <p>This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button
                                className="modal-btn modal-btn-danger"
                                onClick={handleDeleteConfirm}
                            >
                                Yes, Delete
                            </button>
                            <button
                                className="modal-btn modal-btn-cancel"
                                onClick={handleDeleteCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVacations;
