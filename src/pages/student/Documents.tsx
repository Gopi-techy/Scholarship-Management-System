import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import DocumentUpload from '../../components/DocumentUpload';

const Documents: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Documents
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Upload and manage your documents here. Supported file types include PDF and images.
        </Typography>
        <DocumentUpload />
      </Box>
    </Container>
  );
};

export default Documents; 