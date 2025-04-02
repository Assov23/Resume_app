import React, { useState } from 'react';
import { 
  Box, Container, Typography, Tabs, Tab, AppBar, Toolbar, 
  Button, IconButton, Menu, MenuItem
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ResumeList from './ResumeList';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth';

function Dashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Административная панель
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Выйти
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
            <Tab label="Резюме" />
            <Tab label="Пользователи" />
            <Tab label="Настройки" />
          </Tabs>
        </Box>
        
        {tabValue === 0 && (
          <Box sx={{ py: 2 }}>
            <ResumeList />
          </Box>
        )}
        
        {tabValue === 1 && (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6">Управление пользователями</Typography>
            <Typography>Функциональность будет добавлена в следующей версии.</Typography>
          </Box>
        )}
        
        {tabValue === 2 && (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6">Настройки системы</Typography>
            <Typography>Функциональность будет добавлена в следующей версии.</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Dashboard;