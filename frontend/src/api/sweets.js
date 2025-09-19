
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5001/api' });

// This automatically adds the token to every request
api.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getAllSweets = () => api.get('/sweets');
export const purchaseSweet = (id) => api.post(`/sweets/${id}/purchase`);