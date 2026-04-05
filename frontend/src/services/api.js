import axios from 'axios';

const API_URL = 'https://airpure-real-time-air-pollution.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 30000, 
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log request in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`📡 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        }
        
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => {
       
        if (process.env.NODE_ENV === 'development') {
            console.log(`✅ Response: ${response.status} ${response.config.url}`);
        }
        return response;
    },
    (error) => {
        if (error.response) {
           
            console.error(`❌ API Error ${error.response.status}:`, error.response.data);
            
            
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            
            return Promise.reject(error);
        } else if (error.request) {
           
            console.error('❌ Network Error: No response from server');
            return Promise.reject(new Error('Cannot connect to server. Please check your connection.'));
        } else {
          
            console.error('❌ Error:', error.message);
            return Promise.reject(error);
        }
    }
);


export const authAPI = {
    signup: (userData) => api.post('/auth/signup', userData),
    login: (credentials) => api.post('/auth/login', credentials),
};

export const airQualityAPI = {
    getByCity: (city) => api.get(`/airquality?city=${encodeURIComponent(city)}`),
    getByLocation: (lat, lon) => api.get(`/airquality/location?lat=${lat}&lon=${lon}`),
    getForecast: (city) => api.get(`/airquality/forecast?city=${encodeURIComponent(city)}`),
};

export const compareAPI = {
    compareCities: (city1, city2) => api.get(`/compare?city1=${encodeURIComponent(city1)}&city2=${encodeURIComponent(city2)}`),
};

export const reportsAPI = {
    getReport: (city) => api.get(`/reports?city=${encodeURIComponent(city)}`),
};

export const alertsAPI = {
    getAll: () => api.get('/alerts'),
    create: (data) => api.post('/alerts', data),
    delete: (id) => api.delete(`/alerts/${id}`),
};

export default api;