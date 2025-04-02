import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper,
  AppBar,
  Toolbar,
  ButtonGroup,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Hello() {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Узел сбора анкет
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<UploadFileIcon />}
            onClick={() => navigate('/login')}
          >
            Load Anketa
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ p: 4, minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            Добро пожаловать
          </Typography>
          
          <Typography variant="body1" paragraph align="center">
            Вы находитесь на странице обычного узла для сбора анкет в демилитаризованной зоне.
          </Typography>
          
          <Typography variant="body1" paragraph align="center">
            Эта система позволяет загружать, хранить и управлять резюме кандидатов.
          </Typography>
          
          <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
            Выберите способ загрузки анкеты:
          </Typography>
          
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={5}>
              <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom align="center">
                  Загрузить анонимно
                </Typography>
                <Typography variant="body2" paragraph align="center" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  Быстрая загрузка без регистрации. Вы останетесь анонимным, но не сможете управлять своими файлами.
                </Typography>
                <Button 
                  variant="outlined" 
                  fullWidth
                  startIcon={<VisibilityOffIcon />}
                  onClick={() => navigate('/upload-anonymous')}
                >
                  Анонимная загрузка
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={5}>
              <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom align="center">
                  Войти в аккаунт
                </Typography>
                <Typography variant="body2" paragraph align="center" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  Войдите в систему или создайте новый аккаунт. Вы сможете управлять своими файлами и отслеживать их статус.
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth
                  startIcon={<PersonIcon />}
                  onClick={() => navigate('/login')}
                >
                  Войти / Зарегистрироваться
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      
      <Box component="footer" sx={{ textAlign: 'center', mt: 4, p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Узел сбора анкет. Все права защищены.
        </Typography>
      </Box>
    </Box>
  );
}

export default Hello;