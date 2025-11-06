import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Avatar,
  LinearProgress,
  AppBar,
  Toolbar,
  Stack,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockOutlined as LockIcon,
  Email as EmailIcon,
  PersonAdd as PersonAddIcon,
  School as SchoolIcon,
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
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  // Set page title
  useDocumentTitle('Sign Up');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await register(values.email, values.password);
        toast.success('Registration successful! Please log in.');
        navigate('/login');
      } catch (error) {
        toast.error('Failed to register. Please try again.');
        console.error('Registration error:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 10) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const passwordStrength = getPasswordStrength(formik.values.password);
  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'error';
    if (passwordStrength < 70) return 'warning';
    return 'success';
  };

  return (
    <Box>
      {/* Transparent Navbar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
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

            {/* Auth Buttons */}
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'flex' },
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Login
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          py: 4,
          pt: 12,
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
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            animation: `${fadeIn} 0.8s ease-out`,
          }}
        >
          {/* Logo/Icon */}
          <Box
            sx={{
              animation: `${fadeInUp} 0.8s ease-out`,
              mb: 3,
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'white',
                color: 'primary.main',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }}
            >
              <PersonAddIcon sx={{ fontSize: 40 }} />
            </Avatar>
          </Box>

          <Paper
            elevation={12}
            sx={{
              p: { xs: 3, sm: 5 },
              width: '100%',
              borderRadius: 3,
              animation: `${fadeInUp} 0.8s ease-out 0.2s both`,
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 1,
              }}
            >
              Create Account
            </Typography>
            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Sign up to get started with your scholarship journey
            </Typography>

            <form onSubmit={formik.handleSubmit}>
              <Box sx={{ animation: `${slideInLeft} 0.6s ease-out 0.3s both` }}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  margin="normal"
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Box>

              <Box sx={{ animation: `${slideInLeft} 0.6s ease-out 0.4s both` }}>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  margin="normal"
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
                {formik.values.password && (
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Password Strength:
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: `${getStrengthColor()}.main`,
                        }}
                      >
                        {passwordStrength < 40
                          ? 'Weak'
                          : passwordStrength < 70
                          ? 'Medium'
                          : 'Strong'}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={passwordStrength}
                      color={getStrengthColor()}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                )}
              </Box>

              <Box sx={{ animation: `${slideInLeft} 0.6s ease-out 0.5s both` }}>
                <TextField
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)
                  }
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  margin="normal"
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Box>

              <Box sx={{ animation: `${slideInLeft} 0.6s ease-out 0.6s both` }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </Box>

              <Divider sx={{ my: 3, animation: `${fadeIn} 0.8s ease-out 0.7s both` }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Box
                sx={{
                  textAlign: 'center',
                  animation: `${fadeIn} 0.8s ease-out 0.8s both`,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    sx={{
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </form>
          </Paper>

          {/* Back to Home */}
          <Box
            sx={{
              mt: 3,
              animation: `${fadeIn} 0.8s ease-out 0.9s both`,
            }}
          >
            <Button
              component={RouterLink}
              to="/"
              sx={{
                color: 'white',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              ← Back to Home
            </Button>
          </Box>
        </Box>
      </Container>
      </Box>
    </Box>
  );
};

export default Register; 