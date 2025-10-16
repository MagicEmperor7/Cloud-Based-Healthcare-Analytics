const host = 'localhost';   
const express = require('express')
const cors = require('cors');
const testQuestions = require('./testQuestions');
const OpenAI = require("openai");
require("dotenv").config();


const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  

const app = express()

app.use(cors());
app.use(express.json()); 

const port = 8080

const URI = 'mongodb://localhost:27017/';

const nicknames = [
    'CalmRiver',
    'GentleBreeze',
    'TranquilLotus',
    'PeacefulPath',
    'SoftCloud',
    'SereneLake',
    'QuietDove',
    'StillWillow',
    'SilentStream',
    'RestfulShade',
    'BraveOak',
    'StrongHorizon',
    'BoldPhoenix',
    'ResilientTiger',
    'SteadyStone',
    'FierceFlame',
    'IronWill',
    'SolidRoot',
    'FearlessBear',
    'ToughShell',
    'GrowingLight',
    'HealingTree',
    'BloomingSoul',
    'EvolvingMind',
    'RisingSun',
    'FreshStart',
    'NewLeaf',
    'BlossomingPath',
    'AwakeningSpirit',
    'RebornLotus',
    'JoyfulWave',
    'BrightStar',
    'HopeFox',
    'KindSpark',
    'CheerfulGlow',
    'SunnyRay',
    'UpliftWing',
    'LightBeacon',
    'SmileSky',
    'GoldenTrail',
    'LovingHeart',
    'CaringSoul',
    'GentleTouch',
    'KindWhisper',
    'WarmHug',
    'OpenMind',
    'GratefulWish',
    'TenderHope',
    'EmpathyFlame',
];

function generateNickname() {
    return nicknames[Math.floor(Math.random() * nicknames.length)];
}

app.post('/signup', async function(req, res) {
    const { username, firstName, lastName, password } = req.body;
    console.log('Received Signup Data:', { username, firstName, lastName });

    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db('userDatabase'); 
        const usersCollection = db.collection('users');
        const doctorsCollection = db.collection('doctors');

        // Check for duplicate username in both users and doctors collections
        const existingUser = await usersCollection.findOne({ username }) || 
                            await doctorsCollection.findOne({ username });
        
        if (existingUser) {
            await client.close();
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Generate a unique nickname
        let nickname;
        let isUnique = false;
        while (!isUnique) {
            nickname = generateNickname();
            const existingNickname = await usersCollection.findOne({ nickname }) || 
                                   await doctorsCollection.findOne({ nickname });
            if (!existingNickname) {
                isUnique = true;
            }
        }

        // Create initial profile data
        const userData = { 
            username,
            firstName, 
            lastName,
            password, 
            nickname,
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            dateOfBirth: '',
            gender: '',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await usersCollection.insertOne(userData);
        await client.close();
        res.json({ message: 'User registered successfully', nickname });
    } catch (error) {
        console.error('Error inserting user:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

app.get('/test-questions/:type', (req, res) => {
    const testType = req.params.type;
    const questions = testQuestions[testType];
    
    if (questions) {
        res.json(questions);
    } else {
        res.status(404).send('Test type not found');
    }
});

app.post('/login', async function(req, res) {
    const { username, password } = req.body;
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db('userDatabase');
        const usersCollection = db.collection('users');
        const doctorsCollection = db.collection('doctors');

        const doctor = await doctorsCollection.findOne({ username, password });
        if (doctor) {
            await client.close();
            return res.json({ message: 'Doctor login successful', isDoctor: true, nickname: doctor.nickname || username });
        }

        const user = await usersCollection.findOne({ username, password });
        await client.close();

        if (user) {
            res.json({ message: 'Login successful', isDoctor: false, nickname: user.nickname || username });
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Error logging in');
    }
});

app.get('/user-count', async function(req, res) {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db('userDatabase');
        const usersCollection = db.collection('users');

        const count = await usersCollection.countDocuments();
        await client.close();

        res.json({ count });
    } catch (error) {
        console.error('Error fetching user count:', error);
        res.status(500).send('Error fetching user count');
    }
});

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
}

app.get('/api/doctors/nearby', async function(req, res) {
    const { lat, lng, radius = 10, specialization = '' } = req.query;
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    if (isNaN(userLat) || isNaN(userLng)) {
        return res.status(400).json({ error: 'Invalid coordinates' });
    }

    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db('userDatabase');
        const doctorsCollection = db.collection('doctors');

        // Find doctors within the radius
        const doctors = await doctorsCollection.find({
            isDoctor: true,
            ...(specialization ? { specialization } : {})
        }).toArray();

        // Calculate distance for each doctor and filter by radius
        const nearbyDoctors = doctors
            .map(doctor => {
                const distance = calculateDistance(
                    userLat,
                    userLng,
                    doctor.location.lat,
                    doctor.location.lng
                );
                return { ...doctor, distance };
            })
            .filter(doctor => doctor.distance <= radius)
            .sort((a, b) => a.distance - b.distance);

        await client.close();
        res.json(nearbyDoctors);
    } catch (error) {
        console.error('Error finding nearby doctors:', error);
        res.status(500).json({ error: 'Error finding nearby doctors' });
    }
});

// Middleware to verify user is logged in
const verifyUser = async (req, res, next) => {
    const username = req.query.username || req.body.username;
    if (!username) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db('userDatabase');
        const usersCollection = db.collection('users');
        const doctorsCollection = db.collection('doctors');

        const user = await usersCollection.findOne({ $or: [{ username }, { nickname: username }] }) || 
                    await doctorsCollection.findOne({ $or: [{ username }, { nickname: username }] });
        await client.close();

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get doctor profile
app.get('/api/doctor/profile', verifyUser, async (req, res) => {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db('userDatabase');
        const doctorsCollection = db.collection('doctors');

        const profile = await doctorsCollection.findOne(
            { $or: [{ username: req.user.username }, { nickname: req.user.nickname }] },
            { projection: { password: 0 } }
        );
        await client.close();

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        console.error('Error fetching doctor profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update doctor profile
app.put('/api/doctor/profile', verifyUser, async (req, res) => {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db('userDatabase');
        const doctorsCollection = db.collection('doctors');

        const updateData = { ...req.body };
        delete updateData.username; // Don't allow username updates
        delete updateData.password; // Don't allow password updates through this endpoint
        updateData.updatedAt = new Date();

        const result = await doctorsCollection.findOneAndUpdate(
            { username: req.user.username },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        await client.close();

        if (!result.value) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // Remove password from response
        const responseData = result.value;
        delete responseData.password;
        
        res.json(responseData);
    } catch (error) {
        console.error('Error updating doctor profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get patient profile
app.get('/api/patient/profile', verifyUser, async (req, res) => {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db('userDatabase');
        const usersCollection = db.collection('users');

        const profile = await usersCollection.findOne(
            { $or: [{ username: req.user.username }, { nickname: req.user.nickname }] },
            { projection: { password: 0 } }
        );
        await client.close();

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update patient profile
app.put('/api/patient/profile', verifyUser, async (req, res) => {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db('userDatabase');
        const usersCollection = db.collection('users');

        const updateData = { ...req.body };
        delete updateData.username; // Don't allow username updates
        delete updateData.password; // Don't allow password updates through this endpoint
        updateData.updatedAt = new Date();

        const result = await usersCollection.findOneAndUpdate(
            { username: req.user.username },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        await client.close();

        if (!result.value) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // Remove password from response
        const responseData = result.value;
        delete responseData.password;
        
        res.json(responseData);
    } catch (error) {
        console.error('Error updating patient profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get doctor dashboard stats
app.get('/api/doctor/stats', verifyUser, async (req, res) => {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db('userDatabase');
        const testsCollection = db.collection('tests');
        const usersCollection = db.collection('users');

        // Get total users count
        const totalUsers = await usersCollection.countDocuments();

        // Get test counts by type
        const testStats = await testsCollection.aggregate([
            { 
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ]).toArray();

        // Convert to the format expected by the frontend
        const stats = {
            totalTests: 0,
            totalUsers,
            depressionTests: 0,
            anxietyTests: 0,
            adhd: 0,
            ocd: 0
        };

        testStats.forEach(stat => {
            const type = stat._id.toLowerCase();
            stats.totalTests += stat.count;
            
            if (type === 'depression') {
                stats.depressionTests = stat.count;
            } else if (type === 'anxiety') {
                stats.anxietyTests = stat.count;
            } else if (type === 'adhd') {
                stats.adhd = stat.count;
            } else if (type === 'ocd') {
                stats.ocd = stat.count;
            }
        });

        await client.close();
        res.json(stats);
    } catch (error) {
        console.error('Error fetching doctor stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get recent test results
app.get('/api/doctor/recent-tests', verifyUser, async (req, res) => {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db('userDatabase');
        const testsCollection = db.collection('tests');
        const usersCollection = db.collection('users');

        // Get recent tests with patient information
        const recentTests = await testsCollection
            .aggregate([
                { $sort: { date: -1 } },
                { $limit: 10 },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'patient'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        type: 1,
                        scorePercentage: 1,
                        severity: 1,
                        patientName: {
                            $concat: [
                                { $arrayElemAt: ['$patient.firstName', 0] },
                                ' ',
                                { $arrayElemAt: ['$patient.lastName', 0] }
                            ]
                        }
                    }
                }
            ])
            .toArray();

        await client.close();
        res.json(recentTests);
    } catch (error) {
        console.error('Error fetching recent tests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Store test result
app.post('/api/test-result', verifyUser, async (req, res) => {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db('userDatabase');
        const testsCollection = db.collection('tests');

        const testData = {
            userId: req.user._id,
            type: req.body.type,
            date: new Date(),
            answers: req.body.answers,
            score: req.body.score,
            maxScore: req.body.maxScore,
            scorePercentage: req.body.scorePercentage,
            severity: req.body.severity,
            resultText: req.body.resultText
        };

        const result = await testsCollection.insertOne(testData);
        await client.close();
        res.json({ message: 'Test result saved successfully', testId: result.insertedId });
    } catch (error) {
        console.error('Error saving test result:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user's test results
app.get('/api/user/test-results', verifyUser, async (req, res) => {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db('userDatabase');
        const testsCollection = db.collection('tests');

        const results = await testsCollection
            .find({ userId: req.user._id })
            .sort({ date: -1 })
            .toArray();

        await client.close();
        res.json(results);
    } catch (error) {
        console.error('Error fetching test results:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//API KEY CALl

const axios = require('axios');
require('dotenv').config();

// AI Chat endpoint
app.post('/api/ask-ai', async (req, res) => {
    try {
        const { message } = req.body;

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4.1-nano-2025-04-14",
                messages: [{ role: "user", content: message }]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ reply: response.data.choices[0].message.content });
    } catch (err) {
        console.error("AI error:", err.response?.data || err.message);
        res.status(500).json({ error: "AI request failed" });
    }
});


app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});
