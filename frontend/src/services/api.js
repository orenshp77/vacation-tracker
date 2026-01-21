import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const api = axios.create({
    baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data)
};

// Vacations API
export const vacationsAPI = {
    getAll: () => api.get('/vacations'),
    getById: (id) => api.get(`/vacations/${id}`),
    create: (formData) => api.post('/vacations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => api.put(`/vacations/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/vacations/${id}`),
    getReport: () => api.get('/vacations/report'),
    downloadCSV: () => api.get('/vacations/csv', { responseType: 'blob' })
};

// Followers API
export const followersAPI = {
    follow: (vacationId) => api.post(`/followers/${vacationId}`),
    unfollow: (vacationId) => api.delete(`/followers/${vacationId}`)
};

export default api;
