import React, { useState, useEffect } from 'react';
import axios from 'axios';
import photo2 from '../assets/photo2.png';

const API_URL = 'https://airpure-aqi-system.onrender.com/api';

export default function Alerts() {
  const [threshold, setThreshold] = useState(150);
  const [city, setCity] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/alerts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(res.data);
    } catch (error) {
      console.error('Error fetching alerts');
    }
  };

  const createAlert = async () => {
    if (!city || !threshold) {
      alert('Please enter city and threshold');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/alerts`, 
        { city_name: city, threshold_value: parseInt(threshold) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAlerts();
      alert('Alert created successfully!');
      setCity('');
    } catch (error) {
      alert('Error creating alert');
    }
  };

  const deleteAlert = async (alertId, cityName) => {
    if (window.confirm(`Delete alert for ${cityName}?`)) {
      setDeleting(alertId);
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/alerts/${alertId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchAlerts();
        alert('Alert deleted successfully!');
      } catch (error) {
        alert('Error deleting alert');
      } finally {
        setDeleting(null);
      }
    }
  };

  const healthTips = [
    '🌿 Use indoor plants like Snake Plant, Aloe Vera for natural air purification',
    '😷 Wear N95 masks when AQI exceeds 150',
    '🏠 Keep windows closed during high pollution days',
    '💨 Use air purifiers in bedrooms, especially for children and elderly',
    '🚶‍♂️ Avoid morning and evening walks when AQI is poor',
    '🥤 Stay hydrated - water helps flush out pollutants',
    '🍎 Eat antioxidant-rich foods (berries, nuts, leafy greens)',
    '🚗 Carpool or use public transport to reduce your carbon footprint'
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 pb-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Side */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 md:p-6 shadow-lg">
            <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <i className="fas fa-bell text-yellow-500"></i> Set Pollution Alert
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">City Name</label>
                <input 
                  placeholder="e.g., Delhi, Mumbai" 
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">AQI Threshold</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={threshold} 
                  onChange={(e) => setThreshold(e.target.value)}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Notify when AQI exceeds this value</p>
              </div>
              <button 
                onClick={createAlert} 
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition font-semibold text-sm md:text-base shadow-md"
              >
                <i className="fas fa-plus-circle mr-2"></i> Create Alert
              </button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 md:p-6 shadow-lg">
            <h3 className="font-bold text-base md:text-lg mb-3 text-gray-900 dark:text-white">📋 Your Active Alerts</h3>
            {alerts.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">No alerts set yet</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {alerts.map(alert => (
                  <div 
                    key={alert.id} 
                    className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg flex justify-between items-center gap-2 hover:shadow-md transition"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                        {alert.city_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Alert when AQI &gt; {alert.threshold_value}
                      </p>
                    </div>
                    <button 
                      onClick={() => deleteAlert(alert.id, alert.city_name)}
                      disabled={deleting === alert.id}
                      className="text-red-500 hover:text-red-700 transition p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 min-w-[36px] min-h-[36px] flex items-center justify-center"
                      title={`Delete alert for ${alert.city_name}`}
                    >
                      {deleting === alert.id ? (
                        <i className="fas fa-spinner fa-spin text-sm"></i>
                      ) : (
                        <span className="text-lg">🗑️</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Side */}
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img 
              src={photo2}
              alt="Air Quality Awareness" 
              className="w-full h-48 md:h-64 object-cover"
            />
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 md:p-6 shadow-lg text-white">
            <h3 className="font-bold text-lg md:text-xl mb-3 md:mb-4 flex items-center gap-2">
              <i className="fas fa-heartbeat"></i> Health Tips
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {healthTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs md:text-sm p-2 rounded-lg bg-white/10">
                  <span className="text-green-300">✓</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}