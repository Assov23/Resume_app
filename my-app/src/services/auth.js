import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
const TOKEN_KEY = 'resume_app_token';
const USER_KEY = 'resume_app_user';

export const login = async (credentials) => {
  // Создаем FormData или используем URLSearchParams вместо JSON
  const formData = new URLSearchParams();
  formData.append('username', credentials.email);  // Важно: именно username, не email
  formData.append('password', credentials.password);
  
  const response = await axios.post(`${API_URL}/auth/login`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  
  const { access_token, user } = response.data;
  
  // Сохраняем токен и данные пользователя в localStorage
  localStorage.setItem(TOKEN_KEY, access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  
  return user;
};

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getCurrentUser = () => {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.is_admin;
};