import React from 'react';
import { Box, Typography, Paper, Grid, TextField, Button } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';

const Contact: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Contact Us
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Get in Touch
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Have questions about our scholarship program? We're here to help!
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email />
                <Typography>support@scholarship.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone />
                <Typography>+1 (555) 123-4567</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn />
                <Typography>123 Education Street, Academic City, 12345</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Send us a Message
            </Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                required
              />
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                required
              />
              <TextField
                label="Subject"
                variant="outlined"
                fullWidth
                required
              />
              <TextField
                label="Message"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                required
              />
              <Button variant="contained" color="primary" size="large">
                Send Message
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Contact; 