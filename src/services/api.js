import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://sentifi-backend-gqdd.vercel.app';

export const analyzeSentiment = async (text) => {
  const response = await axios.post(API_URL, { text });
  return response.data;
};

export const getHistory = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const deleteHistoryItem = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const getDatasetExportUrl = () => `${API_URL}/export/dataset`;
export const getHistoryExportUrl = () => `${API_URL}/export/history`;