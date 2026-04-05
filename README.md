<div align="center">

# AirPure - Real-Time Air Pollution Monitoring System

![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-18-green)
![Express](https://img.shields.io/badge/Express.js-4.x-orange)
![MySQL](https://img.shields.io/badge/MySQL-8.x-blue)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-Styled-purple)
![JWT](https://img.shields.io/badge/JWT-Auth-red)
![OpenWeatherMap](https://img.shields.io/badge/API-OpenWeatherMap-yellow)
![License](https://img.shields.io/badge/License-MIT-green)

### 🌍 Breathe Better, Live Better! 🌿💨

[Live Demo](https://airpure-detection.netlify.app/) | [Backend API](https://airpure-real-time-air-pollution.onrender.com) | [Report Issue](https://github.com/subhambxt03/AirPure---Real-Time-Air-Pollution-Monitoring-System/issues)

</div>

---

## 📋 Overview

AirPure is a comprehensive, full-stack air pollution monitoring web application that provides real-time Air Quality Index (AQI) data for cities worldwide. Built with modern web technologies, it offers users an intuitive dashboard to track air pollution levels, compare cities, generate detailed reports, and set personalized alerts for unhealthy air quality conditions.

The application fetches live data from OpenWeatherMap Air Pollution API, calculates AQI using US EPA standards, and presents insights through interactive charts, maps, and visual indicators.

---

## ✨ Features

### 🏠 Dashboard Home
- Hero section with animated introduction
- Feature cards for quick navigation (Live AQI, Compare Cities, Reports, Alerts)
- Real-time statistics display

### 🌬️ Air Quality Monitoring
- Search any city worldwide
- Current location detection
- Real-time AQI display (0-500 scale)
- Pollutant breakdown: PM2.5, PM10, CO, O₃, NO₂, SO₂
- Interactive map with city markers
- AQI meter with visual color coding
- Health recommendations based on AQI levels

### 📊 City Comparison
- Side-by-side comparison of two cities
- Color-coded AQI cards
- Detailed pollutant comparison
- Winner banner showing better air quality
- 8-point comprehensive summary with health advice

### 📈 Analytics & Reports
- Interactive bar chart for pollutant levels
- Line chart for weekly AQI trends
- Real-time trend data generation
- Downloadable PDF reports
- Professional report summary with recommendations

### 🔔 Smart Alerts System
- Set custom AQI thresholds for specific cities
- Manage multiple city alerts
- Delete alerts with confirmation
- 8+ health tips for pollution prevention
- Visual alert history

### 👤 User Authentication
- Secure JWT-based authentication
- User registration and login
- Personalized user profiles
- Search history tracking
- Logout functionality

### 🎨 Modern UI/UX
- Dark/Light mode toggle with sliding animation
- Fully responsive design (mobile, tablet, desktop)
- Collapsible sidebar navigation
- Gradient color scheme (Green & Purple themes)
- Smooth animations and transitions

---

## 🖼️ Screenshots

<p align="center">
  <img src="screenshots/home.png" width="900" alt="Home Dashboard"/>
</p>

<p align="center">
  <img src="screenshots/airquality.png" width="900" alt="Air Quality Section"/>
</p>

<p align="center">
  <img src="screenshots/compare.png" width="900" alt="City Comparison"/>
</p>

---

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Leaflet.js
- Chart.js
- Context API
- Font Awesome

### Backend
- Node.js
- Express.js
- JWT
- Bcryptjs
- MySQL2

### Database
- users
- favorite_cities
- alerts
- search_history

### External APIs
- OpenWeatherMap Geocoding API
- OpenWeatherMap Air Pollution API

---

## 📊 AQI Calculation Methodology

The application uses US EPA standards for AQI calculation based on PM2.5 concentration:

| AQI Range | Category | Color | Health Implications |
|-----------|----------|-------|---------------------|
| 0-50 | Good | Green | Air quality is satisfactory, minimal risk |
| 51-100 | Moderate | Yellow | Acceptable air quality, sensitive individuals may experience issues |
| 101-150 | Unhealthy for Sensitive | Orange | Members of sensitive groups may experience health effects |
| 151-200 | Unhealthy | Red | Everyone may begin to experience health effects |
| 201-300 | Very Unhealthy | Purple | Health alert - everyone may experience serious health effects |
| 301-500 | Hazardous | Maroon | Health warnings of emergency conditions |

**Formula used:**
AQI = ((AQI_high - AQI_low) / (Conc_high - Conc_low)) × (Conc - Conc_low) + AQI_low

text

---

## 📁 Project Structure

```text
air-pollution-monitor/
├── backend/
│   ├── controllers/
│   │   └── weatherController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── airquality.js
│   │   ├── compare.js
│   │   ├── reports.js
│   │   └── alerts.js
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── AirQuality.jsx
    │   │   ├── CompareCities.jsx
    │   │   ├── Reports.jsx
    │   │   ├── Alerts.jsx
    │   │   ├── Login.jsx
    │   │   └── Signup.jsx
    │   ├── context/
    │   │   ├── ThemeContext.jsx
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── assets/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── index.html
🚀 Installation
bash
# Clone the repository
git clone https://github.com/subhambxt03/AirPure---Real-Time-Air-Pollution-Monitoring-System.git

# Backend setup
cd AirPure---Real-Time-Air-Pollution-Monitoring-System/backend
npm install
npm run dev

# Frontend setup (new terminal)
cd ../frontend
npm install
npm run dev
🔧 Environment Variables
Backend (.env)
env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=air_pollution_db
JWT_SECRET=your_super_secret_key
OPENWEATHER_API_KEY=your_api_key_here
NODE_ENV=development
Frontend (.env)
env
VITE_API_URL=http://localhost:5000/api
📱 Responsive Design
Device	Breakpoint	Layout Behavior
Desktop	> 1024px	Full sidebar, side-by-side cards, expanded charts
Tablet	768px - 1024px	Collapsible sidebar, responsive grid layout
Mobile	< 768px	Hamburger menu, stacked cards, full-width components
🔒 Security Features
JWT token-based authentication with expiration

Password hashing with bcrypt

Protected API routes with middleware

SQL injection prevention via parameterized queries

CORS configuration for allowed origins

Environment variables for sensitive data

🌟 Unique Selling Points
Feature	Benefit
Accurate AQI Calculation	Uses official US EPA formulas
Real-Time Data	Live updates from OpenWeatherMap API
User Personalization	Custom alerts and search history
Professional Dashboard	Modern UI with eco-friendly design
Complete Analytics	Charts, trends, and PDF reports
Health-Focused	Actionable recommendations for users
Production Ready	Scalable architecture with error handling
📈 Use Cases
User Type	Application
General Public	Check daily air quality before outdoor activities
Health Conscious Users	Monitor pollution levels to protect respiratory health
Parents	Ensure safe outdoor play for children
Elderly & Sensitive Groups	Receive alerts when air quality worsens
Researchers	Analyze pollution trends across cities
Environmental Activists	Track and compare pollution levels
📧 Contact
Project Link: https://github.com/subhambxt03/AirPure---Real-Time-Air-Pollution-Monitoring-System

Live Demo: https://airpure-detection.netlify.app/

Backend API: https://airpure-real-time-air-pollution.onrender.com

<div align="center">
⭐ Star this project if you find it useful! ⭐
Made with ❤️ for a cleaner, healthier planet

</div> ```
