import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import photo1 from '../assets/photo1.png';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const features = [
    { icon: 'fas fa-chart-line', title: 'Live AQI', desc: 'Real-time air quality monitoring', color: 'green', path: '/air-quality' },
    { icon: 'fas fa-city', title: 'Compare Cities', desc: 'Side by side analysis', color: 'purple', path: '/compare' },
    { icon: 'fas fa-file-alt', title: 'Reports', desc: 'Detailed insights & trends', color: 'green', path: '/reports' },
    { icon: 'fas fa-bell', title: 'Alerts', desc: 'Smart notifications', color: 'purple', path: '/alerts' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Monitor Air Pollution <span className="text-green-500">in Real Time</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
            Monitor the air you breathe with real-time updates on pollution levels across major cities. This platform provides accurate insights into air quality, helping you stay aware of environmental conditions around you. From AQI levels to key pollutants like PM2.5 and PM10, everything is presented in a simple and easy-to-understand way. Stay informed, take precautions when needed, and make better decisions for your health and daily activities.
          </p>
          <div className="flex gap-4 justify-center lg:justify-start">
            <button 
              onClick={() => user ? navigate('/air-quality') : navigate('/login')} 
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition shadow-lg font-medium"
            >
              Check Air Quality
            </button>
            <button 
              onClick={() => user ? navigate('/compare') : navigate('/login')} 
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition shadow-lg font-medium"
            >
              Compare Cities
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <img 
            src={photo1}
            alt="Air Quality Dashboard" 
            className="rounded-2xl shadow-lg w-full max-w-2xl h-auto object-cover"
            style={{ maxHeight: '400px' }}
          />
        </div>
      </div>
      
      {/* Feature Cards with Visible Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <div 
            key={idx} 
            className={`bg-gradient-to-br ${
              feature.color === 'green' 
                ? 'from-green-500 to-green-700' 
                : 'from-purple-500 to-purple-700'
            } p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer`}
          >
            <i className={`${feature.icon} text-4xl mb-3 text-white`}></i>
            <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
            <p className="text-white/80 text-sm mb-4">{feature.desc}</p>
            <button 
              onClick={() => user ? navigate(feature.path) : navigate('/login')}
              className="w-full mt-2 px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition font-medium shadow-md"
            >
              View {feature.title}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}