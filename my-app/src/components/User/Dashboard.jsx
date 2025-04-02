import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, AppBar, Toolbar, 
  IconButton, Menu, MenuItem, Button, Paper,
  List, ListItem, ListItemText, ListItemIcon, Divider,
  Tooltip
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser, isAdmin } from '../../services/auth';
import { getMyResumes, downloadResume, deleteResume } from '../../services/api';
import UploadResume from '../Resume/UploadResume';

function UserDashboard() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();
  const userIsAdmin = isAdmin();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await getMyResumes();
      setResumes(data);
    } catch (error) {
      console.error('Ошибка загрузки резюме:', error);
    } finally {
      setLoading(false);
    }
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

  const toggleUploadDialog = () => {
    setUploadOpen(!uploadOpen);
    if (!uploadOpen) {
      // При закрытии диалога, обновляем список резюме
      fetchResumes();
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Личный кабинет
          </Typography>
          
          {userIsAdmin && (
            <Tooltip title="Административная панель">
              <Button
                color="inherit"
                startIcon={<AdminPanelSettingsIcon />}
                onClick={() => navigate('/admin')}
                sx={{ mr: 2 }}
              >
                Админ-панель
              </Button>
            </Tooltip>
          )}
          
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
            <MenuItem disabled>
              <Typography variant="body2">{user?.email}</Typography>
              {userIsAdmin && (
                <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                  (Администратор)
                </Typography>
              )}
            </MenuItem>
            <Divider />
            {userIsAdmin && (
              <MenuItem onClick={() => navigate('/admin')}>
                <AdminPanelSettingsIcon fontSize="small" sx={{ mr: 1 }} />
                Админ-панель
              </MenuItem>
            )}
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Выйти
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Мои резюме</Typography>
            <Button 
              variant="contained" 
              startIcon={<AddCircleIcon />}
              onClick={toggleUploadDialog}
            >
              Загрузить резюме
            </Button>
          </Box>
          
          {resumes.length > 0 ? (
            <List>
              {resumes.map((resume) => (
                <React.Fragment key={resume.id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton 
                          edge="end" 
                          aria-label="download"
                          onClick={() => handleDownload(resume.id, resume.filename)}
                        >
                          <DownloadIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => handleDelete(resume.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      <InsertDriveFileIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={resume.title}
                      secondary={`Загружено: ${new Date(resume.created_at).toLocaleDateString()}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography align="center" color="textSecondary" sx={{ py: 4 }}>
              У вас еще нет загруженных резюме
            </Typography>
          )}
        </Paper>
        
        {uploadOpen && (
          <UploadResume onUploadComplete={toggleUploadDialog} />
        )}
      </Container>
    </Box>
  );
}

export default UserDashboard;