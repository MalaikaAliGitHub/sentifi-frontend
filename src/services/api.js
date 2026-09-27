import axios from 'axios';

// Backend base URL ke sath /api/sentiment
const API_URL = (import.meta.env.VITE_API_URL || 'https://sentifi-backend-np57.vercel.app') + '/api/sentiment';

export const analyzeSentiment = async (text) => {
  // Yahan /analyze hata kar seedha API_URL (yani /api/sentiment/) par POST request bhejo
  const response = await axios.post(`${API_URL}/`, { text });
  return response.data;
};

export const getHistory = async () => {
  const response = await axios.get(`${API_URL}/`);
  return response.data;
};

export const deleteHistoryItem = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const getDatasetExportUrl = () => `${API_URL}/export/dataset`;
export const getHistoryExportUrl = () => `${API_URL}/export/history`;