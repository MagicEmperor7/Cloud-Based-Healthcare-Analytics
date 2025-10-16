import React, { useState, useEffect } from 'react';

const assessments = [
    {
        key: 'Depression',
        icon: '💙',
        title: 'Depression Assessment',
        desc: 'Evaluate symptoms related to mood, energy, and daily functioning',
        btn: 'Begin Depression Assessment',
        className: 'depression'
    },
    {
        key: 'Anxiety',
        icon: '🧠',
        title: 'Anxiety Assessment',
        desc: 'Assess worry, nervousness, and anxiety-related symptoms',
        btn: 'Begin Anxiety Assessment',
        className: 'anxiety'
    },
    {
        key: 'ADHD',
        icon: '🎯',
        title: 'ADHD Assessment',
        desc: 'Evaluate attention, hyperactivity, and impulse control',
        btn: 'Begin ADHD Assessment',
        className: 'adhd'
    },
    {
        key: 'OCD',
        icon: '🔄',
        title: 'OCD Assessment',
        desc: 'Assess obsessive thoughts and compulsive behaviors',
        btn: 'Begin OCD Assessment',
        className: 'ocd'
    }
];

const AssessmentForm = () => {
    const [selectedTest, setSelectedTest] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (selectedTest) {
            setLoading(true);
            setError('');
            fetch(`/test-questions/${selectedTest}`)
                .then(response => response.json())
                .then(data => {
                    setQuestions(data);
                    setAnswers({});
                    const initialAnswers = {};
                    data.forEach(q => initialAnswers[q.id] = '');
                    setAnswers(initialAnswers);
                })
                .catch(err => {
                    console.error('Error fetching questions:', err);
                    setError('Failed to load questions. Please try again.');
                })
                .finally(() => setLoading(false));
        }
    }, [selectedTest]);

    const handleTestSelect = (test) => {
        setSelectedTest(test);
        setResult('');
    };

    const handleChange = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Calculate score based on answers
        const score = Object.values(answers).reduce((total, answer) => {
            switch(answer) {
                case "Nearly every day":
                case "Very Often":
                case "8+ hours":
                case "Severe":
                case "No control":
                    return total + 3;
                case "More than half the days":
                case "Often":
                case "3-8 hours":
                case "Moderately":
                case "Some control":
                    return total + 2;
                case "Several days":
                case "Sometimes":
                case "1-3 hours":
                case "Slightly":
                case "Much control":
                    return total + 1;
                default:
                    return total;
            }
        }, 0);

        const maxScore = questions.length * 3;
        const scorePercentage = (score / maxScore) * 100;
        
        let severity = "";
        let resultText = "";
        let iconColor = "";
        
        if (selectedTest === 'ADHD') {
            if (scorePercentage >= 75) {
                severity = "Highly Likely";
                resultText = "Your responses suggest a high likelihood of ADHD symptoms. We strongly recommend consulting with a mental health professional for a comprehensive evaluation.";
                iconColor = "#dc3545"; // Red
            } else if (scorePercentage >= 50) {
                severity = "Likely";
                resultText = "Your responses suggest ADHD symptoms are likely present. Consider discussing these results with a healthcare provider.";
                iconColor = "#ffc107"; // Yellow
            } else if (scorePercentage >= 25) {
                severity = "Possible";
                resultText = "Your responses suggest ADHD symptoms are possible. Monitor your symptoms and consider a professional evaluation if they persist.";
                iconColor = "#4CAF50"; // Green
            } else {
                severity = "Unlikely";
                resultText = "Your responses suggest ADHD symptoms are unlikely. Continue monitoring your mental health.";
                iconColor = "#4CAF50"; // Green
            }
        } else {
            if (scorePercentage >= 75) {
                severity = "Severe";
                resultText = "Your responses indicate severe symptoms. We strongly recommend consulting with a mental health professional as soon as possible.";
                iconColor = "#dc3545"; // Red
            } else if (scorePercentage >= 50) {
                severity = "Moderate";
                resultText = "Your responses indicate moderate symptoms. We recommend discussing these results with a mental health professional.";
                iconColor = "#ffc107"; // Yellow
            } else if (scorePercentage >= 25) {
                severity = "Mild";
                resultText = "Your responses indicate mild symptoms. Consider discussing these results with a healthcare provider.";
                iconColor = "#4CAF50"; // Green
            } else {
                severity = "Minimal";
                resultText = "Your responses indicate minimal symptoms. Continue monitoring your mental health.";
                iconColor = "#4CAF50"; // Green
            }
        }

        const currentDate = new Date().toLocaleDateString();
        const resultData = {
            date: currentDate,
            type: selectedTest,
            score,
            maxScore,
            severity,
            text: resultText,
            iconColor,
            scorePercentage,
            answers
        };
        
        // Save test result
        const username = localStorage.getItem('username');
        if (username) {
            try {
                const response = await fetch('/api/test-result', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        username,
                        type: selectedTest,
                        answers,
                        score,
                        maxScore,
                        scorePercentage,
                        severity,
                        resultText
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Failed to save test result');
                }
            } catch (error) {
                console.error('Error saving test result:', error);
                setError('Failed to save test result');
            }
        }
        
        setResult(resultData);
    };

    if (!selectedTest) {
        return (
            <div className="main-landing">
                <h1 className="main-heading">Mental Health Self-Assessment</h1>
                <p className="main-subheading">Take a confidential self-assessment to better understand your mental health.<br/>Please note: These assessments are for informational purposes only and do not replace professional medical advice.</p>
                <div className="assessment-cards">
                    {assessments.map(assessment => (
                        <div key={assessment.key} className={`assessment-card ${assessment.className}`}>
                            <span className="assessment-icon" role="img" aria-label={assessment.key}>{assessment.icon}</span>
                            <h2 className="assessment-title">{assessment.title}</h2>
                            <p className="assessment-desc">{assessment.desc}</p>
                            <button 
                                className="assessment-btn"
                                onClick={() => handleTestSelect(assessment.key)}
                            >
                                {assessment.btn}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="footer-note">
                    If you are experiencing a mental health emergency, please contact emergency services immediately.<br/>
                    For crisis support: National Suicide Prevention Lifeline: 988
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading assessment questions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => setSelectedTest('')} className="retry-btn">
                    Go Back
                </button>
            </div>
        );
    }

    if (result) {
        return (
            <div className="results-container">
                <h2>{selectedTest} Assessment Results</h2>
                <p className="completion-date">Completed on {result.date}</p>
                
                <div className="severity-indicator">
                    <div className="severity-icon" style={{ background: result.iconColor }}>✓</div>
                    <h3 className="severity-level" style={{ color: result.iconColor }}>{result.severity}</h3>
                </div>
                
                <p className="result-description">
                    {result.text}
                </p>
                
                <div className="score-bar">
                    <div className="score-text">Score: {result.score} / {result.maxScore} ({Math.round(result.scorePercentage)}%)</div>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{
                                width: `${result.scorePercentage}%`,
                                background: result.iconColor
                            }}
                        ></div>
                    </div>
                </div>
                
                <div className="important-notice">
                    <span className="notice-icon">⚠️</span>
                    <p>Important: This assessment is for informational purposes only and does not constitute a medical diagnosis. If you are experiencing significant distress or symptoms, please consult with a qualified mental health professional.</p>
                </div>
                
                <div className="action-buttons">
                    <button className="primary-btn" onClick={() => setSelectedTest('')}>Take Another Test</button>
                    <button className="secondary-btn" onClick={() => window.location.href = '/find-doctors'}>Find Doctors Near Me</button>
                    <button className="secondary-btn" onClick={() => window.print()}>Print Results</button>
                </div>
                
                <div className="next-steps">
                    <h3>Recommended Next Steps</h3>
                    <p className="subheading">Based on your assessment results</p>
                    <ul>
                        <li>Consider discussing these results with a healthcare provider</li>
                        <li>Keep track of your symptoms and how they affect your daily life</li>
                        <li>Explore healthy coping strategies and self-care practices</li>
                        <li>Reach out to trusted friends, family, or support groups</li>
                        <li>If you're in crisis, contact emergency services or a crisis hotline immediately</li>
                    </ul>
                </div>
                
                <div className="crisis-resources">
                    <h3>Crisis Resources</h3>
                    <div className="resource-grid">
                        <div className="resource-item">
                            <h4>National Suicide Prevention Lifeline</h4>
                            <p className="phone-number">988</p>
                            <p className="availability">24/7 crisis support</p>
                        </div>
                        <div className="resource-item">
                            <h4>Crisis Text Line</h4>
                            <p className="text-number">Text HOME to 741741</p>
                            <p className="availability">24/7 text-based crisis support</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="test">
            <h1>{selectedTest} Assessment</h1>
            <form onSubmit={handleSubmit}>
                {questions.map((q, index) => (
                    <div key={q.id}>
                        <label>{index + 1}. {q.question}</label>
                        <select 
                            value={answers[q.id] || ''} 
                            onChange={(e) => handleChange(q.id, e.target.value)}
                            required
                        >
                            <option value="">Select an answer</option>
                            {q.options.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                ))}
                <button type="submit" className="submitButton">Submit</button>
                <button type="button" className="back-btn" onClick={() => setSelectedTest('')}>
                    Go Back
                </button>
            </form>
        </div>
    );
};

export default AssessmentForm;