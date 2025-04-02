import axios from 'axios';
import { getToken } from './auth';

const API_URL = 'http://localhost:8080/api';

// Настройка axios с токеном авторизации
const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// API для резюме
export const uploadResume = async (formData) => {
  const response = await apiClient.post('/resumes', formData);
  return response.data;
};

export const getResumes = async () => {
  const response = await apiClient.get('/resumes');
  return response.data;
};

export const getMyResumes = async () => {
  const response = await apiClient.get('/resumes/my');
  return response.data;
};

export const downloadResume = async (id, filename) => {
  const response = await apiClient.get(`/resumes/${id}/download`, {
    responseType: 'blob'
  });
  
  // Создаем ссылку для скачивания файла
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const deleteResume = async (id) => {
  await apiClient.delete(`/resumes/${id}`);
};
export const uploadAnonymousResume = async (formData) => {
  const response = await axios.post(`${API_URL}/resumes/anonymous`, formData);
  return response.data;
}; 