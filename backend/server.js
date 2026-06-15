import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { executeEMMDE } from './src/ai/emmde.js';
import { calculateRouteCompatibility } from './src/ai/rcma.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- MOCK IN-MEMORY DATABASE STATE ---
const State = {
    user: {
        name: 'Venkat R.',
        email: 'venkat.r@office.com',
        phone: '9876543210',
        gender: 'male',
        isVerified: true,
        preferences: {
            cost: 0.4,
            time: 0.3,
            comfort: 0.3
        },
        walletBalance: 850.00
    },
    // Global environment sliders adjusted by admin
    context: {
        trafficIndex: 6,
        precipitation: 10,
        demandIndex: 5,
        isPeakHour: false
    },
    // Travel companion requests
    companions: [
        {
            id: 'c1',
            name: 'Priya Sharma',
            gender: 'female',
            age: 26,
            genderPreference: 'same',
            originName: 'Indiranagar Metro',
            destinationName: 'Whitefield ITPL',
            originCoords: [12.9718, 77.6412],
            destinationCoords: [12.9868, 77.7347],
            departureTime: '18:15',
            costShare: 120,
            isVerified: true,
            avatarSeed: 'priya'
        },
        {
            id: 'c2',
            name: 'Amit Verma',
            gender: 'male',
            age: 29,
            genderPreference: 'any',
            originName: 'Koramangala 8th Block',
            destinationName: 'Electronic City Phase 1',
            originCoords: [12.9352, 77.6244],
            destinationCoords: [12.8452, 77.6601],
            departureTime: '08:45',
            costShare: 160,
            isVerified: true,
            avatarSeed: 'amit'
        },
        {
            id: 'c3',
            name: 'Kiran Rao',
            gender: 'female',
            age: 28,
            genderPreference: 'any',
            originName: 'HSR Layout Sector 2',
            destinationName: 'Bellandur Tech Park',
            originCoords: [12.9102, 77.6450],
            destinationCoords: [12.9279, 77.6811],
            departureTime: '19:00',
            costShare: 95,
            isVerified: false,
            avatarSeed: 'kiran'
        }
    ],
    chatHistory: {
        'c1': [
            { sender: 'peer', text: 'Hey Venkat! I saw you posted a commute route to ITPL today. I am departing around 6:15 PM from Indiranagar.', time: '18:02' },
            { sender: 'me', text: 'Hey Priya, yes! I am matching that exact route. Ola Auto shows ₹240 total right now, so cost sharing is perfect.', time: '18:04' },
            { sender: 'peer', text: 'Awesome! Let\'s coordinate at the station exit gate. Shall we book the Auto?', time: '18:05' }
        ]
    },
    systemLogs: [
        { timestamp: '10:00:02', message: 'SmartRide AI Engine initialization completed.', type: 'success' },
        { timestamp: '10:00:05', message: 'EMMDE Decision Matrices recalibrated.', type: 'info' }
    ]
};

// --- AUTHENTICATION ROUTES ---
app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;
    if (email) {
        State.user.email = email;
        State.user.name = email.split('@')[0].toUpperCase();
    }
    res.json({ success: true, user: State.user });
});

app.post('/api/auth/signup', (req, res) => {
    const { name, email, phone } = req.body;
    State.user = {
        ...State.user,
        name,
        email,
        phone,
        walletBalance: 500.00 // Welcome signup bonus
    };
    res.json({ success: true, user: State.user });
});

app.get('/api/auth/profile', (req, res) => {
    res.json(State.user);
});

app.post('/api/auth/profile/update', (req, res) => {
    const { name, preferences, walletBalance } = req.body;
    if (name) State.user.name = name;
    if (preferences) State.user.preferences = { ...State.user.preferences, ...preferences };
    if (walletBalance !== undefined) State.user.walletBalance = walletBalance;
    res.json({ success: true, user: State.user });
});

// --- RIDE COMPARISON (EMMDE) ---
app.post('/api/rides/compare', (req, res) => {
    const { origin, destination, preferences } = req.body;
    
    // Choose appropriate weights
    const userWeights = preferences || State.user.preferences;

    // Run EMMDE Multi-Agent Decision Engine
    const prediction = executeEMMDE(origin, destination, userWeights, State.context);
    
    res.json(prediction);
});

// --- SMART COMMUTE MATCHING (RCMA) ---
app.post('/api/commutes/matches', (req, res) => {
    const { originCoords, destinationCoords, departureTime, gender, genderPreference } = req.body;

    const userMock = {
        originCoords: originCoords || [12.9716, 77.5946],
        destinationCoords: destinationCoords || [12.9868, 77.7347],
        departureTime: departureTime || '18:15',
        gender: gender || State.user.gender,
        genderPreference: genderPreference || 'any',
        isVerified: State.user.isVerified
    };

    // Calculate Route Compatibility Score for each available companion using RCMA
    const matches = State.companions.map(companion => {
        const rcmaResult = calculateRouteCompatibility(userMock, companion);
        return {
            ...companion,
            compatibility: rcmaResult
        };
    }).sort((a, b) => b.compatibility.compatibilityScore - a.compatibility.compatibilityScore);

    res.json(matches);
});

// --- CHAT ENDPOINTS ---
app.get('/api/chat/:companionId', (req, res) => {
    const { companionId } = req.params;
    const history = State.chatHistory[companionId] || [];
    res.json(history);
});

app.post('/api/chat/:companionId/send', (req, res) => {
    const { companionId } = req.params;
    const { text } = req.body;
    
    if (!State.chatHistory[companionId]) {
        State.chatHistory[companionId] = [];
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    State.chatHistory[companionId].push({
        sender: 'me',
        text,
        time: timestamp
    });

    res.json({ success: true, history: State.chatHistory[companionId] });
});

// --- ANALYTICS AND TELEMETRY ---
app.get('/api/analytics', (req, res) => {
    res.json({
        savings: {
            weeklyCostSavings: 280,
            carbonOffsetKg: 14.5,
            rideFrequency: [
                { platform: 'Ola', count: 8 },
                { platform: 'Uber', count: 4 },
                { platform: 'Rapido', count: 12 },
                { platform: 'Multimodal', count: 3 }
            ],
            weeklyExpenses: [
                { day: 'Mon', cost: 180 },
                { day: 'Tue', cost: 220 },
                { day: 'Wed', cost: 140 },
                { day: 'Thu', cost: 310 },
                { day: 'Fri', cost: 240 },
                { day: 'Sat', cost: 190 },
                { day: 'Sun', cost: 140 }
            ]
        },
        logs: State.systemLogs
    });
});

// --- ADMIN TUNE OVERRIDES ---
app.post('/api/admin/tune', (req, res) => {
    const { trafficIndex, precipitation, demandIndex, isPeakHour } = req.body;
    
    if (trafficIndex !== undefined) State.context.trafficIndex = parseInt(trafficIndex);
    if (precipitation !== undefined) State.context.precipitation = parseInt(precipitation);
    if (demandIndex !== undefined) State.context.demandIndex = parseInt(demandIndex);
    if (isPeakHour !== undefined) State.context.isPeakHour = !!isPeakHour;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    State.systemLogs.unshift({
        timestamp,
        message: `Admin environment update: Traffic Index=${State.context.trafficIndex}, Rain=${State.context.precipitation}%, Demand=${State.context.demandIndex}`,
        type: 'warning'
    });

    res.json({ success: true, context: State.context, logs: State.systemLogs });
});

app.get('/api/admin/context', (req, res) => {
    res.json({ context: State.context, logs: State.systemLogs });
});

// Start Server
app.listen(PORT, () => {
    console.log(`[SmartRide AI Backend] Server running on port ${PORT}`);
});
