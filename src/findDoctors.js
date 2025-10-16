import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const FindDoctors = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [searchRadius, setSearchRadius] = useState(10); // in kilometers
    const [specialization, setSpecialization] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const mapRef = useRef(null);

    const mapContainerStyle = {
        width: '100%',
        height: '400px'
    };

    const specializations = [
        'Psychiatrist',
        'Psychologist',
        'Mental Health Counselor',
        'Clinical Social Worker',
        'Marriage and Family Therapist'
    ];

    useEffect(() => {
        // Get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    fetchNearbyDoctors(latitude, longitude);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setLoading(false);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            setLoading(false);
        }
    }, []);

    const fetchNearbyDoctors = async (lat, lng) => {
        try {
            const response = await fetch(`/api/doctors/nearby?lat=${lat}&lng=${lng}&radius=${searchRadius}&specialization=${specialization}`);
            const data = await response.json();
            setDoctors(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSpecializationChange = (e) => {
        setSpecialization(e.target.value);
    };

    const handleRadiusChange = (e) => {
        setSearchRadius(Number(e.target.value));
    };

    const handleSearch = () => {
        if (userLocation) {
            setLoading(true);
            fetchNearbyDoctors(userLocation.lat, userLocation.lng);
        }
    };

    const filteredDoctors = doctors.filter(doctor => {
        const searchLower = searchQuery.toLowerCase();
        return (
            doctor.name.toLowerCase().includes(searchLower) ||
            doctor.specialization.toLowerCase().includes(searchLower) ||
            doctor.address.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="doctor-search">
            <div className="search-header">
                <h1>Find Mental Health Professionals Near You</h1>
            </div>

            <div className="filters">
                <select 
                    className="filter-select"
                    value={specialization}
                    onChange={handleSpecializationChange}
                >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                    ))}
                </select>

                <select 
                    className="filter-select"
                    value={searchRadius}
                    onChange={handleRadiusChange}
                >
                    <option value="5">Within 5 km</option>
                    <option value="10">Within 10 km</option>
                    <option value="20">Within 20 km</option>
                    <option value="50">Within 50 km</option>
                </select>
            </div>

            <div className="search-controls">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by name, specialization, or location..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button className="search-btn" onClick={handleSearch}>
                    Search
                </button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <LoadScript googleMapsApiKey="">
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={userLocation}
                            zoom={12}
                            onLoad={map => {
                                mapRef.current = map;
                            }}
                        >
                            {userLocation && (
                                <Marker
                                    position={userLocation}
                                    icon={{
                                        url: '/user-location-marker.png',
                                        scaledSize: new window.google.maps.Size(30, 30)
                                    }}
                                />
                            )}

                            {filteredDoctors.map(doctor => (
                                <Marker
                                    key={doctor._id}
                                    position={doctor.location}
                                    onClick={() => setSelectedDoctor(doctor)}
                                />
                            ))}

                            {selectedDoctor && (
                                <InfoWindow
                                    position={selectedDoctor.location}
                                    onCloseClick={() => setSelectedDoctor(null)}
                                >
                                    <div>
                                        <h3>{selectedDoctor.name}</h3>
                                        <p>{selectedDoctor.specialization}</p>
                                        <p>{selectedDoctor.address}</p>
                                        <button 
                                            className="contact-btn"
                                            onClick={() => window.location.href = `/doctor/${selectedDoctor._id}`}
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </LoadScript>

                    <div className="doctors-list">
                        {filteredDoctors.map(doctor => (
                            <div key={doctor._id} className="doctor-card">
                                <h3>{doctor.name}</h3>
                                <div className="doctor-info">
                                    <p>{doctor.specialization}</p>
                                    <p>{doctor.address}</p>
                                    <p>{doctor.experience} years of experience</p>
                                </div>
                                <div className="doctor-contact">
                                    <span className="distance">{doctor.distance.toFixed(1)} km away</span>
                                    <button 
                                        className="contact-btn"
                                        onClick={() => window.location.href = `/doctor/${doctor._id}`}
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default FindDoctors; 