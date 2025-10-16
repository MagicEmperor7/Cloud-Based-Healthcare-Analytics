import React, { useState, useEffect } from 'react';
import './app.css';
import Navbar from './navbar';

const Profile = ({ isDoctor }) => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        dateOfBirth: '',
        gender: '',
        // Doctor specific fields
        specialization: '',
        experience: '',
        education: '',
        licenseNumber: '',
        hospitalAffiliation: '',
        consultationFees: '',
        availability: '',
        languages: ''
    });

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        const username = localStorage.getItem('username');
        if (!username) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }

        fetch(`/api/${isDoctor ? 'doctor' : 'patient'}/profile?username=${encodeURIComponent(username)}`, {
            credentials: 'include'
        })
        .then(async res => {
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Failed to fetch profile data');
            }
            return res.json();
        })
        .then(data => {
            if (!data) {
                throw new Error('No profile data received');
            }
            setProfile(data);
            setFormData(data);
            setLoading(false);
        })
        .catch(err => {
            console.error('Error fetching profile:', err);
            setError(err.message);
            setLoading(false);
        });
    }, [isDoctor]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const username = localStorage.getItem('username');
        if (!username) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }

        // Create a copy of formData without modifying the username
        const updateData = { ...formData };
        delete updateData.username; // Remove username from update data as it shouldn't be changed

        fetch(`/api/${isDoctor ? 'doctor' : 'patient'}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ 
                ...updateData,
                username // Add username for authentication
            })
        })
        .then(async res => {
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Failed to update profile');
            }
            return res.json();
        })
        .then(data => {
            if (!data) {
                throw new Error('No profile data received');
            }
            setProfile(data);
            setFormData(data);
            setIsEditing(false);
            setLoading(false);
        })
        .catch(err => {
            console.error('Error updating profile:', err);
            setError(err.message);
            setLoading(false);
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error Loading Profile</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-btn">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>{isDoctor ? 'Doctor Profile' : 'Patient Profile'}</h1>
                {!isEditing && (
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            disabled={true} // Username should never be editable
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                    </div>
                </div>

                <div className="form-group full-width">
                    <label>Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label>City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="form-group">
                        <label>State</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="form-group">
                        <label>ZIP Code</label>
                        <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                {isDoctor && (
                    <div className="doctor-specific-fields">
                        <h2>Professional Information</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Specialization</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    required={isDoctor}
                                />
                            </div>
                            <div className="form-group">
                                <label>Years of Experience</label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    required={isDoctor}
                                />
                            </div>
                            <div className="form-group">
                                <label>License Number</label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    required={isDoctor}
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Education & Qualifications</label>
                                <textarea
                                    name="education"
                                    value={formData.education}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    required={isDoctor}
                                />
                            </div>
                            <div className="form-group">
                                <label>Hospital Affiliation</label>
                                <input
                                    type="text"
                                    name="hospitalAffiliation"
                                    value={formData.hospitalAffiliation}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="form-group">
                                <label>Consultation Fees</label>
                                <input
                                    type="text"
                                    name="consultationFees"
                                    value={formData.consultationFees}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="form-group">
                                <label>Languages Spoken</label>
                                <input
                                    type="text"
                                    name="languages"
                                    value={formData.languages}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="e.g., English, Spanish"
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Availability</label>
                                <textarea
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    placeholder="e.g., Mon-Fri: 9AM-5PM"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {isEditing && (
                    <div className="form-actions">
                        <button type="submit" className="save-btn">Save Changes</button>
                        <button type="button" className="cancel-btn" onClick={() => {
                            setIsEditing(false);
                            setFormData(profile);
                        }}>Cancel</button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Profile; 