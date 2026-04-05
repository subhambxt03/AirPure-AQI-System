// backend/routes/airquality.js
import express from 'express';
import axios from 'axios';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();


router.get('/', authenticateToken, async (req, res) => {
    const { city } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!city) {
        return res.status(400).json({ message: 'City name required' });
    }
    
    try {
        console.log(`📡 Fetching data for city: ${city}`);
        
        // Step 1: Geocoding to get coordinates
        const geoRes = await axios.get(
            `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
        );
        
        if (geoRes.data.length === 0) {
            return res.status(404).json({ message: 'City not found' });
        }
        
        const { lat, lon, name } = geoRes.data[0];
        console.log(`📍 Coordinates for ${name}: lat=${lat}, lon=${lon}`);
        
        // Step 2: Get air pollution data
        const aqiRes = await axios.get(
            `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        
        if (!aqiRes.data || !aqiRes.data.list || aqiRes.data.list.length === 0) {
            return res.status(404).json({ message: 'Air quality data not found' });
        }
        
        const data = aqiRes.data.list[0];
        
       
        try {
            await pool.execute(
                'INSERT INTO search_history (user_id, city_name, aqi) VALUES (?, ?, ?)',
                [req.user.id, name, data.main.aqi]
            );
        } catch (dbError) {
            console.error('Database error (non-critical):', dbError.message);
        }
        
        const result = {
            city: name,
            lat: lat,
            lon: lon,
            aqi: data.main.aqi,
            components: {
                pm2_5: data.components.pm2_5,
                pm10: data.components.pm10,
                co: data.components.co,
                o3: data.components.o3,
                no2: data.components.no2,
                so2: data.components.so2
            },
            timestamp: data.dt
        };
        
        console.log(`✅ Data sent for ${name}`);
        res.json(result);
        
    } catch (error) {
        console.error('❌ API Error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        res.status(500).json({ 
            message: 'Failed to fetch air quality data', 
            error: error.message 
        });
    }
});


router.get('/location', authenticateToken, async (req, res) => {
    const { lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!lat || !lon) {
        return res.status(400).json({ message: 'Latitude and longitude required' });
    }
    
    try {
        console.log(`📍 Fetching data for location: lat=${lat}, lon=${lon}`);
   
        const aqiRes = await axios.get(
            `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        
        if (!aqiRes.data || !aqiRes.data.list || aqiRes.data.list.length === 0) {
            return res.status(404).json({ message: 'Air quality data not found' });
        }
        
    
        const geoRes = await axios.get(
            `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
        );
        
        const cityName = geoRes.data[0]?.name || 'Unknown Location';
        const data = aqiRes.data.list[0];
        
        const result = {
            city: cityName,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            aqi: data.main.aqi,
            components: {
                pm2_5: data.components.pm2_5,
                pm10: data.components.pm10,
                co: data.components.co,
                o3: data.components.o3,
                no2: data.components.no2,
                so2: data.components.so2
            },
            timestamp: data.dt
        };
        
        console.log(`✅ Data sent for location: ${cityName}`);
        res.json(result);
        
    } catch (error) {
        console.error('❌ Location API Error:', error.message);
        res.status(500).json({ 
            message: 'Failed to fetch location data',
            error: error.message
        });
    }
});

router.get('/forecast', authenticateToken, async (req, res) => {
    const { city } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!city) {
        return res.status(400).json({ message: 'City name required' });
    }
    
    try {
        // Get coordinates
        const geoRes = await axios.get(
            `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
        );
        
        if (geoRes.data.length === 0) {
            return res.status(404).json({ message: 'City not found' });
        }
        
        const { lat, lon, name } = geoRes.data[0];
        

        const forecastRes = await axios.get(
            `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        
        const forecast = forecastRes.data.list.map(item => ({
            timestamp: item.dt,
            aqi: item.main.aqi,
            components: {
                pm2_5: item.components.pm2_5,
                pm10: item.components.pm10,
                co: item.components.co,
                o3: item.components.o3
            }
        }));
        
        res.json({
            city: name,
            forecast: forecast.slice(0, 24) // 24 hours forecast
        });
        
    } catch (error) {
        console.error('❌ Forecast API Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch forecast data' });
    }
});

export default router;