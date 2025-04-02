import React, { useState } from 'react';
import { 
  Box, Button, Typography, Container, Paper, 
  Alert, CircularProgress, TextField
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadAnonymousResume } from '../../services/api';
import { useNavigate } from 'react-router-dom';

function AnonymousUpload() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    if (!file) {
      setError('Пожалуйста, выберите файл');
      setLoading(false);
      return;
    }
    
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('title', formData.title);
      data.append('name', formData.name);
      data.append('email', formData.email);
      
      await uploadAnonymousResume(data);
      setSuccess('Резюме успешно загружено! Вы будете перенаправлены на главную страницу.');
      setFile(null);
      setFormData({ title: '', name: '', email: '' });
      
      // Перенаправляем на главную страницу через 3 секунды
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка при загрузке файла');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Анонимная загрузка резюме
        </Typography>
        
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Загрузите ваше резюме без создания аккаунта. Просто заполните форму ниже.
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Название резюме"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Ваше имя"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email для связи"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 2, mb: 2, width: '100%', height: '56px' }}
          >
            {file ? file.name : 'Выбрать файл резюме'}
            <input
              type="file"
              hidden
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </Button>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || !file}
          >
            {loading ? <CircularProgress size={24} /> : 'Загрузить анонимно'}
          </Button>
          
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/')}
          >
            Вернуться на главную
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default AnonymousUpload;