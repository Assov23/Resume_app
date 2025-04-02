import React, { useState } from 'react';
import { 
  Box, Button, Typography, Container, Paper, 
  Alert, CircularProgress, TextField
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadResume } from '../../services/api';

function UploadResume() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      
      await uploadResume(formData);
      setSuccess('Резюме успешно загружено');
      setFile(null);
      setTitle('');
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
          Загрузка резюме
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            {loading ? <CircularProgress size={24} /> : 'Загрузить'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default UploadResume;