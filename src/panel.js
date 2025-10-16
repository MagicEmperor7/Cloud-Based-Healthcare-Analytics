import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Panel = () => {
    const [stats, setStats] = useState({
        totalTests: 0,
        totalUsers: 0,
        depressionTests: 0,
        anxietyTests: 0,
        adhd: 0,
        ocd: 0
    });
    const [recentTests, setRecentTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        // Fetch dashboard statistics and recent tests
        Promise.all([
            fetch(`/api/doctor/stats?username=${encodeURIComponent(username)}`, { 
                credentials: 'include' 
            }).then(async res => {
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText || 'Failed to fetch stats');
                }
                return res.json();
            }),
            fetch(`/api/doctor/recent-tests?username=${encodeURIComponent(username)}`, { 
                credentials: 'include' 
            }).then(async res => {
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText || 'Failed to fetch recent tests');
                }
                return res.json();
            })
        ])
        .then(([statsData, testsData]) => {
            setStats(statsData);
            setRecentTests(testsData);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching dashboard data:', error);
            setError(error.message);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error Loading Dashboard</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-btn">
                    Retry
                </button>
            </div>
        );
    }

    const getSeverityClass = (level) => {
        level = level.toLowerCase();
        if (level === 'minimal' || level === 'unlikely') return 'minimal';
        if (level === 'mild' || level === 'possible') return 'mild';
        if (level === 'moderate' || level === 'likely') return 'moderate';
        if (level === 'severe' || level === 'highly') return 'severe';
        return 'minimal';
    };

    return (
        <div className="panel-page">
            <div className="navbar-section">
                <h2>Doctor Dashboard</h2>
                <button onClick={() => navigate('/profile')} className="edit-btn">View Profile</button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-title">Total Tests</div>
                    <div className="stat-value">{stats.totalTests}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-title">Total Users</div>
                    <div className="stat-value">{stats.totalUsers}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">💙</div>
                    <div className="stat-title">Depression Tests</div>
                    <div className="stat-value">{stats.depressionTests}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🧠</div>
                    <div className="stat-title">Anxiety Tests</div>
                    <div className="stat-value">{stats.anxietyTests}</div>
                </div>
            </div>

            {/* Recent Test Results Table */}
            <div className="recent-tests">
                <h3>Recent Test Results</h3>
                {recentTests.length > 0 ? (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Patient</th>
                                    <th>Test Type</th>
                                    <th>Score</th>
                                    <th>Level</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTests.map((test) => (
                                    <tr key={test._id}>
                                        <td>{new Date(test.date).toLocaleDateString()}</td>
                                        <td>{test.patientName}</td>
                                        <td>{test.type}</td>
                                        <td>{Math.round(test.scorePercentage)}%</td>
                                        <td>
                                            <span className={`level-badge ${getSeverityClass(test.severity)}`}>
                                                {test.severity}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className="view-btn"
                                                onClick={() => navigate(`/test/${test._id}`)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="no-data">No recent tests available</div>
                )}
            </div>

            {/* Test Distribution */}
            <div className="test-distribution">
                <h3>Test Distribution</h3>
                <div className="distribution-grid">
                    <div className="distribution-item">
                        <span className="test-label">Depression</span>
                        <span className="test-count">{stats.depressionTests}</span>
                    </div>
                    <div className="distribution-item">
                        <span className="test-label">Anxiety</span>
                        <span className="test-count">{stats.anxietyTests}</span>
                    </div>
                    <div className="distribution-item">
                        <span className="test-label">ADHD</span>
                        <span className="test-count">{stats.adhd}</span>
                    </div>
                    <div className="distribution-item">
                        <span className="test-label">OCD</span>
                        <span className="test-count">{stats.ocd}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Panel; 