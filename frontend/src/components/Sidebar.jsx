import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: 'fas fa-home', label: 'Home' },
    { path: '/air-quality', icon: 'fas fa-wind', label: 'Air Quality' },
    { path: '/compare', icon: 'fas fa-chart-line', label: 'Compare Cities' },
    { path: '/reports', icon: 'fas fa-chart-bar', label: 'Reports' },
    { path: '/alerts', icon: 'fas fa-bell', label: 'Alerts' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    setSidebarOpen(false);
  };

  return (
    <>
      <aside 
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-slate-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-green-500">AirPure🌿</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Air Quality Monitor</p>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-green-500 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`
                }
              >
                <i className={`${item.icon} w-5 text-lg`}></i>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          
          {/* User Section */}
          <div className="p-4 border-t border-gray-200 dark:border-slate-700">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold shadow-md">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <NavLink 
                  to="/login" 
                  onClick={() => setSidebarOpen(false)}
                  className="block w-full px-4 py-2 text-center text-green-600 border border-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/signup" 
                  onClick={() => setSidebarOpen(false)}
                  className="block w-full px-4 py-2 text-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
                >
                  Signup
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </aside>
           
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}