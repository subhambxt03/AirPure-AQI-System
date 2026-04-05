import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://airpure-real-time-air-pollution.onrender.com/api';

const calculateRealAQI = (apiValue, pm25) => {
  const baseAQI = { 1: 25, 2: 75, 3: 125, 4: 175, 5: 250 };
  let aqi = baseAQI[apiValue] || 125;
  
  if (pm25 > 0) {
    if (pm25 <= 30) aqi = Math.min(aqi, 50);
    else if (pm25 <= 60) aqi = Math.min(aqi, 100);
    else if (pm25 <= 90) aqi = Math.min(aqi, 150);
    else if (pm25 <= 120) aqi = Math.min(aqi, 200);
    else aqi = Math.min(aqi, 300);
  }
  
  const levels = [
    { min: 0, max: 50, label: 'Good', color: '#22c55e', bg: '#22c55e20' },
    { min: 51, max: 100, label: 'Moderate', color: '#eab308', bg: '#eab30820' },
    { min: 101, max: 150, label: 'Unhealthy for Sensitive', color: '#f97316', bg: '#f9731620' },
    { min: 151, max: 200, label: 'Unhealthy', color: '#ef4444', bg: '#ef444420' },
    { min: 201, max: 300, label: 'Very Unhealthy', color: '#7f1d1d', bg: '#7f1d1d20' }
  ];
  
  const level = levels.find(l => aqi >= l.min && aqi <= l.max) || levels[0];
  return { value: aqi, label: level.label, color: level.color, bg: level.bg };
};

export default function CompareCities() {
  const [city1, setCity1] = useState('');
  const [city2, setCity2] = useState('');
  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(false);

  const compare = async () => {
    if (!city1 || !city2) {
      alert('Please enter both city names');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/compare?city1=${city1}&city2=${city2}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const enhanced = {
        city1: res.data.city1 ? { 
          ...res.data.city1, 
          aqiData: calculateRealAQI(res.data.city1.aqi, res.data.city1.components?.pm2_5 || 0) 
        } : null,
        city2: res.data.city2 ? { 
          ...res.data.city2, 
          aqiData: calculateRealAQI(res.data.city2.aqi, res.data.city2.components?.pm2_5 || 0) 
        } : null
      };
      setCompareData(enhanced);
    } catch (error) {
      console.error('Comparison error:', error);
      alert('Error comparing cities. Please try again.');
    }
    setLoading(false);
  };

  const getSummaryPoints = () => {
    if (!compareData?.city1 || !compareData?.city2) return [];
    const better = compareData.city1.aqiData.value < compareData.city2.aqiData.value ? compareData.city1 : compareData.city2;
    const worse = better === compareData.city1 ? compareData.city2 : compareData.city1;
    return [
      `🌿 ${better.city} has BETTER air quality with AQI ${better.aqiData.value} (${better.aqiData.label})`,
      `⚠️ ${worse.city} has POORER air quality at AQI ${worse.aqiData.value} (${worse.aqiData.label})`,
      `📊 PM2.5 difference: ${Math.abs(compareData.city1.components?.pm2_5 - compareData.city2.components?.pm2_5).toFixed(1)} µg/m³`,
      `📊 PM10 difference: ${Math.abs(compareData.city1.components?.pm10 - compareData.city2.components?.pm10).toFixed(1)} µg/m³`,
      `💡 Recommendation: Prefer outdoor activities in ${better.city}`,
      `🏠 ${worse.city} residents should use air purifiers and wear N95 masks when outdoors`,
      `🫁 The air in ${worse.city} is ${Math.round((worse.aqiData.value / better.aqiData.value) * 100)}% more polluted than ${better.city}`,
      `🚗 Consider reducing vehicle usage in ${worse.city} to help improve air quality`
    ];
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 pb-6">
      {/* Search Section - Responsive for Mobile */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            placeholder="City 1 (e.g., Delhi)" 
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
            value={city1} 
            onChange={(e) => setCity1(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && compare()}
          />
          <input 
            placeholder="City 2 (e.g., Mumbai)" 
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
            value={city2} 
            onChange={(e) => setCity2(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && compare()}
          />
        </div>
        <button 
          onClick={compare} 
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition font-medium shadow-md"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <i className="fas fa-spinner fa-spin"></i> Comparing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <i className="fas fa-chart-line"></i> Compare Cities
            </span>
          )}
        </button>
      </div>
      
      {compareData && (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            {/* City 1 Card */}
            {compareData.city1 && (
              <div className="rounded-xl p-5 md:p-6 shadow-lg transition-all hover:shadow-xl" style={{ background: compareData.city1.aqiData.bg, borderLeft: `4px solid ${compareData.city1.aqiData.color}` }}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{compareData.city1.city}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/20 dark:bg-black/20" style={{ color: compareData.city1.aqiData.color }}>
                    AQI Index
                  </span>
                </div>
                <div className="text-5xl md:text-6xl font-bold mb-2" style={{ color: compareData.city1.aqiData.color }}>{compareData.city1.aqiData.value}</div>
                <p className="text-base md:text-lg mb-4 font-semibold" style={{ color: compareData.city1.aqiData.color }}>{compareData.city1.aqiData.label}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-white/50 dark:bg-black/20">
                    <span className="text-gray-500 dark:text-gray-400">PM2.5:</span>
                    <span className="font-semibold text-gray-900 dark:text-white ml-2">{compareData.city1.components?.pm2_5} µg/m³</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/50 dark:bg-black/20">
                    <span className="text-gray-500 dark:text-gray-400">PM10:</span>
                    <span className="font-semibold text-gray-900 dark:text-white ml-2">{compareData.city1.components?.pm10} µg/m³</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/50 dark:bg-black/20">
                    <span className="text-gray-500 dark:text-gray-400">CO:</span>
                    <span className="font-semibold text-gray-900 dark:text-white ml-2">{compareData.city1.components?.co} µg/m³</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/50 dark:bg-black/20">
                    <span className="text-gray-500 dark:text-gray-400">O₃:</span>
                    <span className="font-semibold text-gray-900 dark:text-white ml-2">{compareData.city1.components?.o3} µg/m³</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* City 2 Card */}
            {compareData.city2 && (
              <div className="rounded-xl p-5 md:p-6 shadow-lg transition-all hover:shadow-xl" style={{ background: compareData.city2.aqiData.bg, borderLeft: `4px solid ${compareData.city2.aqiData.color}` }}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{compareData.city2.city}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/20 dark:bg-black/20" style={{ color: compareData.city2.aqiData.color }}>
                    AQI Index
                  </span>
                </div>
                <div className="text-5xl md:text-6xl font-bold mb-2" style={{ color: compareData.city2.aqiData.color }}>{compareData.city2.aqiData.value}</div>
                <p className="text-base md:text-lg mb-4 font-semibold" style={{ color: compareData.city2.aqiData.color }}>{compareData.city2.aqiData.label}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-white/50 dark:bg-black/20">
                    <span className="text-gray-500 dark:text-gray-400">PM2.5:</span>
                    <span className="font-semibold text-gray-900 dark:text-white ml-2">{compareData.city2.components?.pm2_5} µg/m³</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/50 dark:bg-black/20">
                    <span className="text-gray-500 dark:text-gray-400">PM10:</span>
                    <span className="font-semibold text-gray-900 dark:text-white ml-2">{compareData.city2.components?.pm10} µg/m³</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/50 dark:bg-black/20">
                    <span className="text-gray-500 dark:text-gray-400">CO:</span>
                    <span className="font-semibold text-gray-900 dark:text-white ml-2">{compareData.city2.components?.co} µg/m³</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/50 dark:bg-black/20">
                    <span className="text-gray-500 dark:text-gray-400">O₃:</span>
                    <span className="font-semibold text-gray-900 dark:text-white ml-2">{compareData.city2.components?.o3} µg/m³</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Winner Banner */}
          {compareData.city1 && compareData.city2 && (
            <div className={`rounded-xl p-4 text-center shadow-lg ${
              compareData.city1.aqiData.value < compareData.city2.aqiData.value
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gradient-to-r from-orange-500 to-red-600'
            } text-white`}>
              <p className="text-lg font-semibold">
                🏆 {compareData.city1.aqiData.value < compareData.city2.aqiData.value 
                  ? `${compareData.city1.city} has Better Air Quality!` 
                  : `${compareData.city2.city} has Better Air Quality!`}
              </p>
            </div>
          )}
          
          {/* Detailed Summary Card */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-5 md:p-6 shadow-lg text-white">
            <h3 className="font-bold text-lg md:text-xl mb-4 flex items-center gap-2">
              <i className="fas fa-chart-simple"></i> Detailed Comparison Summary
            </h3>
            <div className="space-y-2">
              {getSummaryPoints().map((point, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm md:text-base p-2 rounded-lg bg-white/10">
                  <span className="text-green-300">•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      {/* Empty State */}
      {!compareData && !loading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
            <i className="fas fa-city text-4xl text-gray-400 dark:text-gray-500"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Compare Two Cities</h3>
          <p className="text-gray-500 dark:text-gray-400">Enter two city names above to compare their air quality</p>
        </div>
      )}
    </div>
  );
}