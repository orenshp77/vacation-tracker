import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { vacationsAPI } from '../services/api';
import './Reports.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Reports = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const response = await vacationsAPI.getReport();
            setReportData(response.data);
        } catch (err) {
            setError('Failed to load report data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadCSV = async () => {
        try {
            const response = await vacationsAPI.downloadCSV();
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'vacations_followers.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download CSV:', err);
            alert('Failed to download CSV file');
        }
    };

    const chartData = {
        labels: reportData.map(item => item.destination),
        datasets: [
            {
                label: 'Followers',
                data: reportData.map(item => item.followers),
                backgroundColor: 'rgba(77, 208, 225, 0.8)',
                borderColor: 'rgba(0, 188, 212, 1)',
                borderWidth: 1,
                borderRadius: 4,
                barThickness: 40
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Vacations Report',
                font: {
                    size: 24,
                    weight: '600'
                },
                color: '#00bcd4',
                padding: {
                    bottom: 30
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    font: {
                        size: 12
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 11
                    },
                    maxRotation: 45,
                    minRotation: 45
                },
                grid: {
                    display: false
                }
            }
        }
    };

    if (loading) {
        return <div className="loading">Loading report...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="reports-page">
            <div className="reports-header">
                <h1>Vacations Report</h1>
                <button className="download-btn" onClick={handleDownloadCSV}>
                    📥 Download CSV
                </button>
            </div>

            <div className="chart-container">
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default Reports;
