import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import airqualityRoutes from './routes/airquality.js';
import compareRoutes from './routes/compare.js';
import reportsRoutes from './routes/reports.js';
import alertsRoutes from './routes/alerts.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', (req, res) => {
    res.sendStatus(200);
});

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Backend is running',
        timestamp: new Date().toISOString()
    });
});


app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/airquality', airqualityRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/alerts', alertsRoutes);


app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});