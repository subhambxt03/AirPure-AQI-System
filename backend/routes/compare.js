import express from 'express';
import axios from 'axios';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    const { city1, city2 } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    async function getAQI(city) {
        const geoRes = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`);
        if (geoRes.data.length === 0) return null;
        const { lat, lon, name } = geoRes.data[0];
        const aqiRes = await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        return {
            city: name,
            aqi: aqiRes.data.list[0].main.aqi,
            components: aqiRes.data.list[0].components
        };
    }
    
    const [data1, data2] = await Promise.all([getAQI(city1), getAQI(city2)]);
    res.json({ city1: data1, city2: data2 });
});

export default router;