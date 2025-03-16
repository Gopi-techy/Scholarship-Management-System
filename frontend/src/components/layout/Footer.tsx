import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'primary.main',
        color: 'white',
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} PMSSS Scholarship Management System
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 