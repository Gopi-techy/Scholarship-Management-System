import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export default function Home() {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: 'Easy Application',
      description: 'Simple and streamlined scholarship application process',
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
      title: 'Secure Verification',
      description: 'Advanced document verification using Azure AI',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Data Security',
      description: 'End-to-end encryption for your sensitive information',
    },
    {
      icon: <NotificationsActiveIcon sx={{ fontSize: 40 }} />,
      title: 'Real-time Updates',
      description: 'Instant notifications about your application status',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                component="h1"
                variant="h2"
                sx={{ fontWeight: 'bold', mb: 2 }}
              >
                PMSSS Scholarship Management System
              </Typography>
              <Typography variant="h5" sx={{ mb: 4 }}>
                Streamline your scholarship application process with our secure and
                efficient platform.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/register')}
                sx={{ mr: 2 }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Add an illustration or image here */}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          component="h2"
          variant="h3"
          align="center"
          sx={{ mb: 6 }}
        >
          Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
                elevation={2}
              >
                <Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: theme.palette.grey[100], py: 8 }}>
        <Container maxWidth="md">
          <Typography
            component="h2"
            variant="h4"
            align="center"
            sx={{ mb: 3 }}
          >
            Ready to Apply?
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Join thousands of students who have successfully received scholarships
            through our platform.
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/register')}
            >
              Start Your Application
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
} 