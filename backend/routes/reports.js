import express from 'express';
import axios from 'axios';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    const { city } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    const geoRes = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`);
    if (geoRes.data.length === 0) return res.status(404).json({ message: 'City not found' });
    const { lat, lon, name } = geoRes.data[0];
    
    // Get current data
    const aqiRes = await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const current = aqiRes.data.list[0];
    
    res.json({
        city: name,
        current: {
            aqi: current.main.aqi,
            pm25: current.components.pm2_5,
            pm10: current.components.pm10,
            co: current.components.co,
            o3: current.components.o3,
            no2: current.components.no2
        },
        recommendation: getRecommendation(current.main.aqi)
    });
});

function getRecommendation(aqi) {
    if (aqi <= 50) return 'Excellent air quality - perfect for outdoor activities';
    if (aqi <= 100) return 'Good air quality - safe for everyone';
    if (aqi <= 150) return 'Moderate - sensitive groups should reduce outdoor activity';
    if (aqi <= 200) return 'Unhealthy - wear mask, limit outdoor exposure';
    if (aqi <= 300) return 'Very Unhealthy - avoid outdoor activities';
    return 'Hazardous - stay indoors with air purifier';
}

export default router;