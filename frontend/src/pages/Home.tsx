import { Box, Button, Container, Grid, Typography, Paper, Stack, AppBar, Toolbar, IconButton, useScrollTrigger } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  School as SchoolIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Groups as GroupsIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { keyframes } from '@mui/system';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const features = [
  {
    icon: <SchoolIcon sx={{ fontSize: 50 }} />,
    title: 'Scholarship Management',
    description: 'Easily manage and track scholarship applications in one place.',
  },
  {
    icon: <DescriptionIcon sx={{ fontSize: 50 }} />,
    title: 'Document Management',
    description: 'Secure document upload and verification system for applications.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 50 }} />,
    title: 'Secure Platform',
    description: 'Your data is protected with industry-standard security measures.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 50 }} />,
    title: 'Fast Processing',
    description: 'Quick and efficient application processing system.',
  },
];

const stats = [
  { label: 'Active Students', value: '10,000+', icon: <GroupsIcon /> },
  { label: 'Scholarships', value: '500+', icon: <SchoolIcon /> },
  { label: 'Success Rate', value: '95%', icon: <TrendingUpIcon /> },
];

const Home = () => {
  const navigate = useNavigate();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Transparent Navbar */}
      <AppBar
        position="fixed"
        elevation={trigger ? 4 : 0}
        sx={{
          backgroundColor: trigger ? 'rgba(102, 126, 234, 0.95)' : 'transparent',
          backdropFilter: trigger ? 'blur(10px)' : 'none',
          transition: 'all 0.3s ease',
          borderBottom: trigger ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            >
              <SchoolIcon sx={{ fontSize: 32, color: 'white' }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                ScholarshipHub
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Stack
              direction="row"
              spacing={3}
              sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
            >
              <Button
                color="inherit"
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
                onClick={() => navigate('/')}
              >
                Home
              </Button>
              <Button
                color="inherit"
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                About
              </Button>
              <Button
                color="inherit"
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Features
              </Button>
              <Button
                color="inherit"
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Contact
              </Button>
            </Stack>

            {/* Auth Buttons */}
            <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: '#f0f0f0',
                  },
                }}
              >
                Sign Up
              </Button>
            </Stack>

            {/* Mobile Menu Icon */}
            <IconButton
              sx={{
                display: { xs: 'flex', md: 'none' },
                color: 'white',
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          mb: 6,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  animation: `${slideInLeft} 1s ease-out`,
                }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2,
                  }}
                >
                  Scholarship Management{' '}
                  <Box component="span" sx={{ color: '#ffd700' }}>
                    Made Simple
                  </Box>
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.95,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    lineHeight: 1.6,
                  }}
                >
                  Streamline your scholarship application process with our comprehensive,
                  secure, and efficient platform. Join thousands of successful students.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: '#f0f0f0',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Login
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  animation: `${float} 3s ease-in-out infinite`,
                  display: { xs: 'none', md: 'block' },
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: 300,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 150, opacity: 0.8 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Stats Section */}
          <Grid container spacing={3} sx={{ mt: 6 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    bgcolor: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    animation: `${fadeInUp} 0.8s ease-out ${index * 0.2}s both`,
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 1 }}>{stat.icon}</Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Box
          sx={{
            textAlign: 'center',
            mb: 6,
            animation: `${fadeIn} 1s ease-out`,
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Why Choose Us?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Experience the best-in-class features designed to make scholarship management effortless
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  border: '2px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  animation: `${fadeInUp} 0.8s ease-out ${index * 0.15}s both`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-10px)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.2)',
                    '& .feature-icon': {
                      animation: `${pulse} 1s ease-in-out infinite`,
                    },
                  },
                }}
              >
                <Box
                  className="feature-icon"
                  sx={{
                    color: 'primary.main',
                    mb: 2,
                    bgcolor: 'primary.light',
                    borderRadius: '50%',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  animation: `${fadeInUp} 1s ease-out`,
                }}
              >
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                  Everything You Need in One Place
                </Typography>
                <Stack spacing={2} sx={{ mt: 4 }}>
                  {[
                    'Track all your applications in real-time',
                    'Secure document storage and management',
                    'Get instant notifications on status updates',
                    'AI-powered document verification',
                    'Access from anywhere, anytime',
                  ].map((benefit, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        animation: `${fadeInUp} 0.8s ease-out ${index * 0.1}s both`,
                      }}
                    >
                      <CheckCircleIcon sx={{ color: 'success.main', mr: 2, fontSize: 28 }} />
                      <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                        {benefit}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  animation: `${fadeInUp} 1s ease-out 0.3s both`,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: 'white',
                    width: '100%',
                    maxWidth: 400,
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <DescriptionIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      Smart Document Processing
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      Our AI-powered system automatically verifies and processes your documents,
                      ensuring faster approval times and fewer errors.
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 10,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Paper
            elevation={12}
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              borderRadius: 4,
              animation: `${fadeInUp} 1s ease-out`,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 700, color: 'primary.main' }}
            >
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.8 }}>
              Join thousands of students who have successfully applied for scholarships through
              our platform. Start your journey today!
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Create Free Account
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Learn More
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 