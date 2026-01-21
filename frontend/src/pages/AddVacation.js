import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vacationsAPI } from '../services/api';
import './VacationForm.css';

const AddVacation = () => {
    const [formData, setFormData] = useState({
        destination: '',
        description: '',
        startDate: '',
        endDate: '',
        price: ''
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        if (!formData.destination.trim()) {
            setError('Destination is required');
            return false;
        }
        if (!formData.description.trim()) {
            setError('Description is required');
            return false;
        }
        if (!formData.startDate) {
            setError('Start date is required');
            return false;
        }
        if (!formData.endDate) {
            setError('End date is required');
            return false;
        }
        if (!formData.price) {
            setError('Price is required');
            return false;
        }

        const price = parseFloat(formData.price);
        if (price < 0 || price > 10000) {
            setError('Price must be between 0 and 10,000');
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);

        if (startDate < today) {
            setError('Start date cannot be in the past');
            return false;
        }

        if (endDate < startDate) {
            setError('End date must be after or equal to start date');
            return false;
        }

        if (!image) {
            setError('Image is required');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const data = new FormData();
            data.append('destination', formData.destination);
            data.append('description', formData.description);
            data.append('startDate', formData.startDate);
            data.append('endDate', formData.endDate);
            data.append('price', formData.price);
            data.append('image', image);

            await vacationsAPI.create(data);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add vacation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="form-card">
                <h1 className="form-title">Add Vacation</h1>

                {error && <div className="form-error">{error}</div>}

                <form onSubmit={handleSubmit} className="vacation-form">
                    <div className="form-group">
                        <label>destination</label>
                        <input
                            type="text"
                            name="destination"
                            value={formData.destination}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label>start on</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>end on</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>price</label>
                        <div className="price-input">
                            <span className="currency-symbol">$</span>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                max="10000"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>cover image</label>
                        <div className="image-upload">
                            {imagePreview ? (
                                <div className="image-preview">
                                    <img src={imagePreview} alt="Preview" />
                                    <button
                                        type="button"
                                        className="change-image-btn"
                                        onClick={() => document.getElementById('imageInput').click()}
                                    >
                                        Change Image
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className="upload-placeholder"
                                    onClick={() => document.getElementById('imageInput').click()}
                                >
                                    <span className="upload-icon">📁</span>
                                    <span>Select Image</span>
                                </div>
                            )}
                            <input
                                id="imageInput"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Vacation'}
                    </button>

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate('/admin')}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddVacation;
