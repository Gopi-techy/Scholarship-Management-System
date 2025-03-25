import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

interface SystemSettings {
  siteName: string;
  contactEmail: string;
  maxFileSize: number;
  allowedFileTypes: string;
  enableEmailNotifications: boolean;
  enableDocumentVerification: boolean;
  maintenanceMode: boolean;
}

const defaultSettings: SystemSettings = {
  siteName: 'Scholarship Management System',
  contactEmail: 'admin@example.com',
  maxFileSize: 10,
  allowedFileTypes: '.pdf,.jpg,.jpeg,.png',
  enableEmailNotifications: true,
  enableDocumentVerification: true,
  maintenanceMode: false,
};

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof SystemSettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : event.target.value;
    
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the settings
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        System Settings
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              General Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Site Name"
              value={settings.siteName}
              onChange={handleChange('siteName')}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Email"
              value={settings.contactEmail}
              onChange={handleChange('contactEmail')}
              type="email"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Document Settings
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Maximum File Size (MB)"
              value={settings.maxFileSize}
              onChange={handleChange('maxFileSize')}
              type="number"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Allowed File Types"
              value={settings.allowedFileTypes}
              onChange={handleChange('allowedFileTypes')}
              helperText="Comma-separated list of file extensions"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              System Features
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableEmailNotifications}
                  onChange={handleChange('enableEmailNotifications')}
                />
              }
              label="Enable Email Notifications"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableDocumentVerification}
                  onChange={handleChange('enableDocumentVerification')}
                />
              }
              label="Enable Document Verification"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.maintenanceMode}
                  onChange={handleChange('maintenanceMode')}
                  color="error"
                />
              }
              label="Maintenance Mode"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
              >
                Save Settings
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Settings; 