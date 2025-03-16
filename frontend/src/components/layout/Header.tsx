import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PMSSS Scholarship
        </Typography>
        {user ? (
          <>
            <Button color="inherit" onClick={() => navigate('/')}>
              Home
            </Button>
            {user.role === 'student' && (
              <Button color="inherit" onClick={() => navigate('/student')}>
                Dashboard
              </Button>
            )}
            {user.role === 'admin' && (
              <>
                <Button color="inherit" onClick={() => navigate('/admin')}>
                  Dashboard
                </Button>
                <Button color="inherit" onClick={() => navigate('/admin/verify')}>
                  Verify Documents
                </Button>
                <Button color="inherit" onClick={() => navigate('/admin/analyze')}>
                  Document Analysis
                </Button>
              </>
            )}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate('/register')}>
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 