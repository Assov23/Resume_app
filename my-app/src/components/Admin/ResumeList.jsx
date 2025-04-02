import React, { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Typography, TextField, InputAdornment,
  CircularProgress, Chip, Container
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { getResumes, downloadResume, deleteResume } from '../../services/api';

function ResumeList() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newResumes, setNewResumes] = useState([]);
  const [lastCheckTime, setLastCheckTime] = useState(localStorage.getItem('lastCheckTime') || null);
  
  useEffect(() => {
    fetchResumes();
  }, []);

  const checkForNewResumes = (resumes) => {
    if (!lastCheckTime) {
      return [];
    }
    
    const lastCheck = new Date(lastCheckTime);
    return resumes.filter(resume => new Date(resume.created_at) > lastCheck);
  };

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await getResumes();
      setResumes(data);
      
      const newOnes = checkForNewResumes(data);
      setNewResumes(newOnes);
      
      const now = new Date().toISOString();
      localStorage.setItem('lastCheckTime', now);
      setLastCheckTime(now);
    } catch (error) {
      console.error('Ошибка загрузки резюме:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      await downloadResume(id, filename);
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это резюме?')) {
      try {
        await deleteResume(id);
        fetchResumes();
      } catch (error) {
        console.error('Ошибка при удалении резюме:', error);
      }
    }
  };

  const filteredResumes = resumes.filter(resume => 
    resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resume.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Список резюме
          {newResumes.length > 0 && (
            <Chip 
              color="primary"
              label={`Новых: ${newResumes.length}`}
              sx={{ ml: 2 }}
            />
          )}
        </Typography>
        
        <TextField
          fullWidth
          margin="normal"
          variant="outlined"
          placeholder="Поиск по названию или email пользователя"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Название</TableCell>
                  <TableCell>Пользователь/Автор</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Дата загрузки</TableCell>
                  <TableCell>Формат</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredResumes.length > 0 ? (
                  filteredResumes.map((resume) => {
                    const isNew = newResumes.some(r => r.id === resume.id);
                    const isAnonymous = !resume.user_id;
                    
                    return (
                      <TableRow 
                        key={resume.id}
                        sx={{ backgroundColor: isNew ? 'rgba(25, 118, 210, 0.08)' : 'inherit' }}
                      >
                        <TableCell>{resume.title}</TableCell>
                        <TableCell>
                          {isAnonymous ? (
                            <>
                              {resume.anonymous_name}
                              <Chip 
                                size="small" 
                                label="Анонимно" 
                                sx={{ ml: 1 }}
                                color="default"
                              />
                            </>
                          ) : (
                            resume.user?.email?.split('@')[0]
                          )}
                        </TableCell>
                        <TableCell>
                          {isAnonymous ? resume.anonymous_email : resume.user?.email}
                        </TableCell>
                        <TableCell>{new Date(resume.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip 
                            label={resume.file_type} 
                            color={
                              resume.file_type === 'pdf' ? 'error' :
                              resume.file_type === 'docx' ? 'primary' : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DownloadIcon />}
                            onClick={() => handleDownload(resume.id, resume.filename)}
                            sx={{ mr: 1 }}
                          >
                            Скачать
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDelete(resume.id)}
                          >
                            Удалить
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Резюме не найдены
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
}

export default ResumeList;