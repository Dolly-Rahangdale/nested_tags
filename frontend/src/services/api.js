import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const treeApi = {
  getAllTrees: () => api.get('/trees/'),
  getTree: (id) => api.get(`/trees/${id}`),
  createTree: (data) => api.post('/trees/', data),
  updateTree: (id, data) => api.put(`/trees/${id}`, data),
  deleteTree: (id) => api.delete(`/trees/${id}`),
};

export default api;