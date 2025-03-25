import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        backgroundColor: theme.palette.mode === 'light' ? 'grey.100' : 'grey.900',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.drawer - 1,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Scholarship Management System. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <IconButton color="primary" size="small">
              <Facebook />
            </IconButton>
            <IconButton color="primary" size="small">
              <Twitter />
            </IconButton>
            <IconButton color="primary" size="small">
              <LinkedIn />
            </IconButton>
            <IconButton color="primary" size="small">
              <Instagram />
            </IconButton>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer; 