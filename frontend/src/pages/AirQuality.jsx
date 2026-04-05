import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const API_URL = 'https://airpure-real-time-air-pollution.onrender.com/api';

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Calculate accurate AQI from API data
const calculateRealAQI = (apiValue, pm25) => {
  const baseAQI = { 1: 25, 2: 75, 3: 125, 4: 175, 5: 250 };
  let aqi = baseAQI[apiValue] || 125;
  
  if (pm25 > 0) {
    if (pm25 <= 12) aqi = 50;
    else if (pm25 <= 35.4) aqi = 100;
    else if (pm25 <= 55.4) aqi = 150;
    else if (pm25 <= 150.4) aqi = 200;
    else if (pm25 <= 250.4) aqi = 300;
    else aqi = 400;
  }
  
  const levels = [
    { min: 0, max: 50, label: 'Good', color: '#22c55e', bg: '#22c55e20' },
    { min: 51, max: 100, label: 'Moderate', color: '#eab308', bg: '#eab30820' },
    { min: 101, max: 150, label: 'Unhealthy for Sensitive', color: '#f97316', bg: '#f9731620' },
    { min: 151, max: 200, label: 'Unhealthy', color: '#ef4444', bg: '#ef444420' },
    { min: 201, max: 300, label: 'Very Unhealthy', color: '#7f1d1d', bg: '#7f1d1d20' }
  ];
  
  const level = levels.find(l => aqi >= l.min && aqi <= l.max) || levels[0];
  return { value: aqi, ...level };
};

export default function AirQuality() {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');

  // Search for city
  const fetchAQI = async (cityName) => {
    if (!cityName.trim()) {
      setError('Please enter a city name');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      console.log(`Searching for: ${cityName}`);
      console.log(`API URL: ${API_URL}/airquality?city=${cityName}`);
      
      const response = await axios.get(`${API_URL}/airquality?city=${encodeURIComponent(cityName)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('API Response:', response.data);
      
      if (response.data && response.data.city) {
        const aqiData = calculateRealAQI(
          response.data.aqi, 
          response.data.components?.pm2_5 || 0
        );
        
        setData({
          ...response.data,
          realAQI: aqiData.value,
          aqiLabel: aqiData.label,
          aqiColor: aqiData.color,
          aqiBg: aqiData.bg
        });
        setError('');
      } else {
        setError('City not found. Please try a different city name.');
      }
    } catch (err) {
      console.error('API Error:', err);
      if (err.response) {
        setError(err.response.data.message || 'City not found. Please try again.');
      } else if (err.request) {
        setError('Cannot connect to server. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
    setLoading(false);
  };

  // Get current location
  const getCurrentLocation = () => {
    setLocationLoading(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const token = localStorage.getItem('token');
          const { latitude, longitude } = position.coords;
          console.log(`Location: ${latitude}, ${longitude}`);
          
          const response = await axios.get(`${API_URL}/airquality/location?lat=${latitude}&lon=${longitude}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          console.log('Location response:', response.data);
          
          if (response.data && response.data.city) {
            const aqiData = calculateRealAQI(
              response.data.aqi, 
              response.data.components?.pm2_5 || 0
            );
            
            setData({
              ...response.data,
              realAQI: aqiData.value,
              aqiLabel: aqiData.label,
              aqiColor: aqiData.color,
              aqiBg: aqiData.bg
            });
            setCity(response.data.city);
            setError('');
          } else {
            setError('Could not get air quality data for your location');
          }
        } catch (err) {
          console.error('Location error:', err);
          setError('Could not get location data. Please try searching for a city.');
        }
        setLocationLoading(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        if (err.code === 1) {
          setError('Please allow location access to use this feature');
        } else {
          setError('Unable to get your location. Please search for a city.');
        }
        setLocationLoading(false);
      }
    );
  };

  const healthRecommendations = [
    { icon: '✅', text: 'Check AQI before planning outdoor activities' },
    { icon: '😷', text: 'Wear N95 mask when AQI is above 150' },
    { icon: '🏠', text: 'Keep windows closed during high pollution days' },
    { icon: '💨', text: 'Use air purifier in bedrooms' },
    { icon: '🚶', text: 'Avoid morning walks when AQI is poor' },
    { icon: '💧', text: 'Stay hydrated - water helps flush out pollutants' }
  ];

  const mapTileUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 pb-6">
      {/* Search Section */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex gap-2 max-w-md">
          <input 
            type="text" 
            placeholder="Enter city name (e.g., Delhi, London, Tokyo)" 
            value={city} 
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchAQI(city)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button 
            onClick={() => fetchAQI(city)} 
            disabled={loading}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Search'}
          </button>
        </div>
        <button 
          onClick={getCurrentLocation} 
          disabled={locationLoading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 justify-center"
        >
          <i className="fas fa-location-dot"></i>
          {locationLoading ? 'Getting...' : 'Current Location'}
        </button>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      )}

      {data && (
        <>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - AQI Cards */}
            <div className="space-y-4">
              <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: data.aqiBg, borderLeft: `4px solid ${data.aqiColor}` }}>
                <div className="text-center">
                  <div className="text-7xl font-bold mb-2" style={{ color: data.aqiColor }}>{data.realAQI}</div>
                  <div className="text-2xl font-semibold mb-1" style={{ color: data.aqiColor }}>{data.aqiLabel}</div>
                  <p className="text-gray-600 dark:text-gray-300">{data.city}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl shadow-md bg-gradient-to-br from-green-500/20 to-green-600/20 border-l-4 border-green-500">
                  <p className="text-sm text-gray-600 dark:text-gray-300">PM2.5</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.components?.pm2_5 || 0} <span className="text-sm">µg/m³</span></p>
                </div>
                <div className="p-4 rounded-xl shadow-md bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-l-4 border-purple-500">
                  <p className="text-sm text-gray-600 dark:text-gray-300">PM10</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.components?.pm10 || 0} <span className="text-sm">µg/m³</span></p>
                </div>
                <div className="p-4 rounded-xl shadow-md bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600 dark:text-gray-300">CO</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.components?.co || 0} <span className="text-sm">µg/m³</span></p>
                </div>
                <div className="p-4 rounded-xl shadow-md bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-l-4 border-orange-500">
                  <p className="text-sm text-gray-600 dark:text-gray-300">O₃</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.components?.o3 || 0} <span className="text-sm">µg/m³</span></p>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Last updated: {data.timestamp ? new Date(data.timestamp * 1000).toLocaleString() : 'N/A'}
              </p>
            </div>
            
            {/* Right Column - Map */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-2 shadow-lg">
              {data.lat && data.lon && (
                <MapContainer 
                  center={[data.lat, data.lon]} 
                  zoom={10} 
                  style={{ height: '380px', width: '100%', borderRadius: '12px' }}
                >
                  <TileLayer url={mapTileUrl} />
                  <Marker position={[data.lat, data.lon]}>
                    <Popup>
                      <div>
                        <strong>{data.city}</strong><br />
                        AQI: {data.realAQI} ({data.aqiLabel})<br />
                        PM2.5: {data.components?.pm2_5 || 0} µg/m³
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              )}
            </div>
          </div>
          
          {/* Health Recommendations */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 shadow-lg text-white">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <i className="fas fa-heartbeat"></i> Health Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {healthRecommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-white/10">
                  <span className="text-xl">{rec.icon}</span>
                  <span className="text-sm text-white/90">{rec.text}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}