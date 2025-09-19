// frontend/src/api/sweet.js
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5001/api' });

api.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getAllSweets = () => api.get('/sweets');
export const searchSweets = (searchParams) => api.get(`/sweets/search`, { params: searchParams });
export const purchaseSweet = (id) => api.post(`/sweets/${id}/purchase`);
export const restockSweet = (id, amount) => api.post(`/sweets/${id}/restock`, { amount });

// New admin-only API calls
export const createSweet = (newSweetData) => api.post('/sweets', newSweetData);
export const updateSweet = (id, updatedSweetData) => api.put(`/sweets/${id}`, updatedSweetData);
export const deleteSweet = (id) => api.delete(`/sweets/${id}`);