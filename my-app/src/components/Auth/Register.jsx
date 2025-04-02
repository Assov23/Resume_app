import React, { useState } from 'react';
import { 
  Box, Button, TextField, Typography, Container, 
  Paper, Alert, CircularProgress, Link
} from '@mui/material';
import { register } from '../../services/auth';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [userData, setUserData] = useState({ email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Проверка совпадения паролей
    if (userData.password !== userData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }
    
    try {
      await register({ email: userData.email, password: userData.password });
      navigate('/login', { state: { message: 'Регистрация успешна. Теперь вы можете войти.' } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Регистрация
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={userData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="new-password"
            value={userData.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Подтвердите пароль"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={userData.confirmPassword}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Зарегистрироваться'}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
          >
            Уже есть аккаунт? Войти
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;