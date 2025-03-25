import React from 'react';
import { Box, Typography, Paper, Avatar, Grid, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto',
                mb: 2,
                fontSize: '3rem',
              }}
            >
              {user?.name?.[0] || 'U'}
            </Avatar>
            <Button variant="contained" color="primary">
              Change Photo
            </Button>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1">{user?.name || 'Not set'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{user?.email || 'Not set'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1">
                  {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Not set'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  Edit Profile
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile; 