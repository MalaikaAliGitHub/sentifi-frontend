import axios from 'axios';

// Backend base URL ke sath /api/sentiment lazmi lagana hai
const API_URL = (import.meta.env.VITE_API_URL || 'https://sentifi-backend-np57.vercel.app') + '/api/sentiment';

export const analyzeSentiment = async (text) => {
  // Yeh request ab banegi: .../api/sentiment/analyze (ya jo route tumne backend mein diya ho)
  const response = await axios.post(`${API_URL}/analyze`, { text });
  return response.data;
};

export const getHistory = async () => {
  // Yeh request ab banegi: .../api/sentiment/
  const response = await axios.get(`${API_URL}/`);
  return response.data;
};

export const deleteHistoryItem = async (id) => {
  // Yeh request ab banegi: .../api/sentiment/:id
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const getDatasetExportUrl = () => `${API_URL}/export/dataset`;
export const getHistoryExportUrl = () => `${API_URL}/export/history`;