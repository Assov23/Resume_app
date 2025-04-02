import React, { useState } from 'react';
import { 
  Box, Button, TextField, Typography, Container, 
  Paper, Alert, CircularProgress
} from '@mui/material';
import { login } from '../../services/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Вход
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
            value={credentials.email}
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
            autoComplete="current-password"
            value={credentials.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Войти'}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/register')}
          >
            Нет аккаунта? Зарегистрироваться
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;