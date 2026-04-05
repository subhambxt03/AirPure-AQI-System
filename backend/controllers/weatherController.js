import axios from 'axios';

export const getAirQuality = async (city, apiKey) => {
  try {
    // Geocoding
    const geoRes = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
    );
    
    if (geoRes.data.length === 0) {
      throw new Error('City not found');
    }
    
    const { lat, lon, name } = geoRes.data[0];
    
    // Air pollution
    const aqiRes = await axios.get(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    
    const data = aqiRes.data.list[0];
    
    return {
      city: name,
      lat,
      lon,
      aqi: data.main.aqi,
      components: data.components,
      timestamp: data.dt
    };
  } catch (error) {
    throw error;
  }
};

export const getAQILevel = (aqi) => {
  const levels = [
    { range: [1, 1], text: 'Good', color: '#22c55e', recommendation: 'Perfect for outdoor activities' },
    { range: [2, 2], text: 'Fair', color: '#a3e635', recommendation: 'Good for most people' },
    { range: [3, 3], text: 'Moderate', color: '#eab308', recommendation: 'Sensitive groups reduce outdoor time' },
    { range: [4, 4], text: 'Poor', color: '#f97316', recommendation: 'Wear mask outdoors' },
    { range: [5, 5], text: 'Very Poor', color: '#ef4444', recommendation: 'Avoid outdoor exercise' },
    { range: [6, 6], text: 'Severe', color: '#7f1d1d', recommendation: 'Stay indoors with purifier' }
  ];
  return levels.find(l => aqi >= l.range[0] && aqi <= l.range[1]) || levels[0];
};