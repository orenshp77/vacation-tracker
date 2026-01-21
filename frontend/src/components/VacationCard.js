import React from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatPrice, getImageUrl, truncateText } from '../utils/helpers';
import './VacationCard.css';

const VacationCard = ({ vacation, onFollow, onUnfollow, onEdit, onDelete }) => {
    const { isAdmin } = useAuth();

    const handleFollowClick = () => {
        if (vacation.isFollowing) {
            onUnfollow(vacation.id);
        } else {
            onFollow(vacation.id);
        }
    };

    return (
        <div className="vacation-card">
            <div className="vacation-image-container">
                <img
                    src={getImageUrl(vacation.imageName)}
                    alt={vacation.destination}
                    className="vacation-image"
                />
                {!isAdmin() && (
                    <button
                        className={`follow-btn ${vacation.isFollowing ? 'following' : ''}`}
                        onClick={handleFollowClick}
                    >
                        <span className="heart-icon">{vacation.isFollowing ? '❤️' : '🤍'}</span>
                        <span className="follow-count">Like {vacation.followersCount}</span>
                    </button>
                )}
                {isAdmin() && (
                    <div className="admin-actions">
                        <button className="edit-btn" onClick={() => onEdit(vacation.id)}>
                            ✏️ Edit
                        </button>
                        <button className="delete-btn" onClick={() => onDelete(vacation.id)}>
                            🗑️ Delete
                        </button>
                    </div>
                )}
            </div>

            <div className="vacation-content">
                <h3 className="vacation-destination">{vacation.destination}</h3>

                <div className="vacation-dates">
                    <span className="date-icon">📅</span>
                    <span>{formatDate(vacation.startDate)} - {formatDate(vacation.endDate)}</span>
                </div>

                <p className="vacation-description">
                    {truncateText(vacation.description, 180)}
                </p>

                <div className="vacation-price">
                    {formatPrice(vacation.price)}
                </div>
            </div>
        </div>
    );
};

export default VacationCard;
