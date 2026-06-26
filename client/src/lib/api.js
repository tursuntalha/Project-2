import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const searchProducts = (q) => api.get('/search', { params: { q } });
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getCart = () => api.get('/cart');
export const addToCart = (productId, quantity = 1) => api.post('/cart/add', { productId, quantity });
export const removeFromCart = (productId) => api.post('/cart/remove', { productId });
export const checkout = (address) => api.post('/orders/checkout', { address });
export const getOrders = () => api.get('/orders');
export const generateDescription = (data) => api.post('/ai/generate-description', data);
export const getRecommendations = (productId) => api.post('/ai/recommend', { productId });
export const getAnomalies = () => api.get('/anomalies');
