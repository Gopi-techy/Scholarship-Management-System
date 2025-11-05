import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import DocumentUpload from '../../components/forms/DocumentUpload';

const Documents: React.FC = () => {
  const handleUploadComplete = (document: any) => {
    console.log('Document uploaded:', document);
    // You can add additional logic here, like refreshing the documents list
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Documents
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Upload and manage your documents here. Supported file types include PDF and images.
        </Typography>
        <DocumentUpload 
          documentType="general" 
          onUploadComplete={handleUploadComplete}
        />
      </Box>
    </Container>
  );
};

export default Documents; 