import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Container,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.email?.split('@')[0] || 'Student'}!
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Application Status
                </Typography>
                <Typography variant="body1">
                  You haven't submitted an application yet.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Start Application
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Documents
                </Typography>
                <Typography variant="body1">
                  Upload and manage your documents here.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Manage Documents
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default StudentDashboard; 