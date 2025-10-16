import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './app.css';

const Results = () => {
    const [userResults, setUserResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            navigate('/');
            return;
        }

        setLoading(true);
        fetch(`/api/user/test-results?username=${encodeURIComponent(username)}`, {
            credentials: 'include'
        })
        .then(async res => {
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Failed to fetch test results');
            }
            return res.json();
        })
        .then(data => {
            setUserResults(data);
            setLoading(false);
        })
        .catch(err => {
            console.error('Error fetching test results:', err);
            setError('Failed to load test history');
            setLoading(false);
        });
    }, [navigate]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your test history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error Loading Results</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-btn">
                    Retry
                </button>
            </div>
        );
    }

    const getSeverityClass = (severity) => {
        severity = severity.toLowerCase();
        if (severity === 'minimal' || severity === 'unlikely') return 'minimal';
        if (severity === 'mild' || severity === 'possible') return 'mild';
        if (severity === 'moderate' || severity === 'likely') return 'moderate';
        if (severity === 'severe' || severity === 'highly') return 'severe';
        return 'minimal';
    };

    return (
        <div className="test-history">
            <h2>Your Test History</h2>
            {userResults.length === 0 ? (
                <div className="no-results">
                    <p>You haven't taken any tests yet.</p>
                    <button className="primary-btn" onClick={() => navigate('/')}>
                        Take Your First Test
                    </button>
                </div>
            ) : (
                <div className="history-grid">
                    {userResults.map((result, index) => (
                        <div key={index} className="history-card">
                            <div className="test-header">
                                <h3>{result.type} Assessment</h3>
                                <span className="test-date">
                                    {new Date(result.date).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="test-score">
                                <span className="score-label">Score</span>
                                <span className="score-value">
                                    {Math.round(result.scorePercentage)}%
                                </span>
                            </div>
                            <div className={`severity-badge ${getSeverityClass(result.severity)}`}>
                                {result.severity}
                            </div>
                            <p className="result-text">{result.resultText}</p>
                            <button 
                                className="view-btn"
                                onClick={() => navigate(`/test/${result._id}`)}
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Results; 