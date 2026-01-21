import React, { useState, useEffect, useMemo } from 'react';
import { vacationsAPI, followersAPI } from '../services/api';
import VacationCard from '../components/VacationCard';
import Pagination from '../components/Pagination';
import { isVacationActive, isVacationFuture } from '../utils/helpers';
import './Vacations.css';

const ITEMS_PER_PAGE = 10;

const Vacations = () => {
    const [vacations, setVacations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Filters
    const [showFollowing, setShowFollowing] = useState(false);
    const [showFuture, setShowFuture] = useState(false);
    const [showActive, setShowActive] = useState(false);

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

    const handleFollow = async (vacationId) => {
        try {
            await followersAPI.follow(vacationId);
            setVacations(prev => prev.map(v =>
                v.id === vacationId
                    ? { ...v, isFollowing: true, followersCount: v.followersCount + 1 }
                    : v
            ));
        } catch (err) {
            console.error('Failed to follow:', err);
        }
    };

    const handleUnfollow = async (vacationId) => {
        try {
            await followersAPI.unfollow(vacationId);
            setVacations(prev => prev.map(v =>
                v.id === vacationId
                    ? { ...v, isFollowing: false, followersCount: v.followersCount - 1 }
                    : v
            ));
        } catch (err) {
            console.error('Failed to unfollow:', err);
        }
    };

    // Filter vacations
    const filteredVacations = useMemo(() => {
        let result = [...vacations];

        if (showFollowing) {
            result = result.filter(v => v.isFollowing);
        }
        if (showFuture) {
            result = result.filter(v => isVacationFuture(v.startDate));
        }
        if (showActive) {
            result = result.filter(v => isVacationActive(v.startDate, v.endDate));
        }

        return result;
    }, [vacations, showFollowing, showFuture, showActive]);

    // Pagination
    const totalPages = Math.ceil(filteredVacations.length / ITEMS_PER_PAGE);
    const paginatedVacations = filteredVacations.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [showFollowing, showFuture, showActive]);

    const handleFilterChange = (filter) => {
        switch (filter) {
            case 'following':
                setShowFollowing(!showFollowing);
                break;
            case 'future':
                setShowFuture(!showFuture);
                break;
            case 'active':
                setShowActive(!showActive);
                break;
            default:
                break;
        }
    };

    if (loading) {
        return <div className="loading">Loading vacations...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="vacations-page">
            <div className="vacations-header">
                <h1>Explore Vacations</h1>
                <p>Find your perfect getaway and follow your favorite destinations</p>
            </div>

            <div className="filters-container">
                <label className={`filter-checkbox ${showFollowing ? 'active' : ''}`}>
                    <input
                        type="checkbox"
                        checked={showFollowing}
                        onChange={() => handleFilterChange('following')}
                    />
                    <span>My Followed</span>
                </label>

                <label className={`filter-checkbox ${showFuture ? 'active' : ''}`}>
                    <input
                        type="checkbox"
                        checked={showFuture}
                        onChange={() => handleFilterChange('future')}
                    />
                    <span>Not Started</span>
                </label>

                <label className={`filter-checkbox ${showActive ? 'active' : ''}`}>
                    <input
                        type="checkbox"
                        checked={showActive}
                        onChange={() => handleFilterChange('active')}
                    />
                    <span>Active Now</span>
                </label>
            </div>

            {filteredVacations.length === 0 ? (
                <div className="no-results">
                    <p>No vacations found with the selected filters.</p>
                </div>
            ) : (
                <>
                    <div className="vacations-grid">
                        {paginatedVacations.map(vacation => (
                            <VacationCard
                                key={vacation.id}
                                vacation={vacation}
                                onFollow={handleFollow}
                                onUnfollow={handleUnfollow}
                            />
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
};

export default Vacations;
