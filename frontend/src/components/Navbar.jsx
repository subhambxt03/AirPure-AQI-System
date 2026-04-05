import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { user } = useAuth();
  const { darkMode, setDarkMode } = useTheme();

  return (
    <nav className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <i className="fas fa-leaf text-green-500 text-sm sm:text-base md:text-xl"></i>
          <h1 className="text-sm sm:text-lg md:text-xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
            AirPure
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <span
              className={`text-[9px] sm:text-xs md:text-sm font-medium ${
                !darkMode ? 'text-yellow-600' : 'text-gray-400'
              }`}
            >
              Light
            </span>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="relative rounded-full bg-gray-300 dark:bg-gray-700 shadow-inner transition-all duration-300
                w-[36px] h-[16px] md:w-[52px] md:h-[26px]"
            >
              <div
                className={`absolute rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center
                  w-[10px] h-[10px] md:w-[22px] md:h-[22px] top-1/2 -translate-y-1/2 ${
                    darkMode ? 'left-auto right-[3px] md:right-[2px]' : 'left-[3px] md:left-[2px]'
                  }`}
              >
                <i
                  className={`fas ${darkMode ? 'fa-moon' : 'fa-sun'} text-[5px] md:text-xs ${
                    darkMode ? 'text-blue-600' : 'text-yellow-500'
                  }`}
                ></i>
              </div>
            </button>

            <span
              className={`text-[9px] sm:text-xs md:text-sm font-medium ${
                darkMode ? 'text-blue-400' : 'text-gray-400'
              }`}
            >
              Dark
            </span>
          </div>

          {user && (
            <>
              <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  Hello, {user.name?.split(' ')[0]} 👋
                </span>
              </div>

              <div className="hidden sm:flex md:hidden items-center space-x-1.5 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-xs">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-gray-800 dark:text-white">
                  Hi 👋
                </span>
              </div>
            </>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 transition shadow-md"
          >
            <span className="text-base sm:text-lg">☰</span>
          </button>
        </div>
      </div>

      {user && (
        <div className="sm:hidden px-3 pb-1.5 flex items-center gap-1.5 border-t border-gray-100 dark:border-slate-800 pt-1.5">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-[9px]">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">
            Hello, {user.name?.split(' ')[0]}
          </span>
        </div>
      )}
    </nav>
  );
}