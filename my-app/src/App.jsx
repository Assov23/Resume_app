import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { isAuthenticated, isAdmin } from './services/auth';

// Компоненты для аутентификации
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AnonymousUpload from './components/Resume/AnonymousUpload';
// Компоненты для пользователей
import UserDashboard from './components/User/Dashboard';
import UploadResume from './components/Resume/UploadResume';

// Компоненты для администраторов
import AdminDashboard from './components/Admin/Dashboard';

// Новый компонент для главной страницы
import Hello from './components/Hello';

// Защищенные маршруты
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const auth = isAuthenticated();
  const admin = isAdmin();
  
  if (!auth) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !admin) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Создание темы Material UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Новый маршрут для главной страницы */}
          <Route path="/" element={<Hello />} />
          
          {/* Публичные маршруты */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload-anonymous" element={<AnonymousUpload />} />
          {/* Маршруты для пользователей */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <UploadResume />
              </ProtectedRoute>
            } 
          />
          
          {/* Маршруты для администраторов */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Перенаправление по умолчанию для неизвестных маршрутов */}
          <Route 
            path="*" 
            element={<Navigate to="/" />} 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;