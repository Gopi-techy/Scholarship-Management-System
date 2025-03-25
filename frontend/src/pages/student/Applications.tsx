import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload,
  RemoveRedEye,
  CheckCircle,
  Pending,
  Error,
  Assignment,
  School,
} from '@mui/icons-material';

const Applications: React.FC = () => {
  const [activeApplication, setActiveApplication] = useState(0);

  // Mock data - replace with actual API calls
  const applications = [
    {
      id: 'APP001',
      scholarshipName: 'Merit Scholarship',
      submittedDate: '2024-03-15',
      status: 'In Progress',
      progress: 60,
      documents: [
        { name: 'Academic Transcript', status: 'Verified' },
        { name: 'Letter of Recommendation', status: 'Pending' },
        { name: 'Personal Statement', status: 'Not Uploaded' },
      ],
      steps: ['Personal Info', 'Documents', 'Review', 'Submit'],
      currentStep: 2,
    },
    {
      id: 'APP002',
      scholarshipName: 'Research Grant',
      submittedDate: '2024-03-10',
      status: 'Submitted',
      progress: 100,
      documents: [
        { name: 'Research Proposal', status: 'Verified' },
        { name: 'Academic Transcript', status: 'Verified' },
        { name: 'Faculty Recommendation', status: 'Verified' },
      ],
      steps: ['Personal Info', 'Documents', 'Review', 'Submit'],
      currentStep: 4,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Not Uploaded':
        return 'error';
      case 'Submitted':
        return 'success';
      default:
        return 'info';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle />;
      case 'Pending':
        return <Pending />;
      case 'Not Uploaded':
        return <Error />;
      default:
        return <Assignment />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Applications
      </Typography>

      <Grid container spacing={3}>
        {/* Active Application */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">
                  {applications[activeApplication].scholarshipName}
                </Typography>
                <Chip
                  label={applications[activeApplication].status}
                  color={getStatusColor(applications[activeApplication].status)}
                  size="small"
                  sx={{ ml: 2 }}
                />
              </Box>

              <Stepper
                activeStep={applications[activeApplication].currentStep - 1}
                sx={{ mb: 4 }}
              >
                {applications[activeApplication].steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <LinearProgress
                variant="determinate"
                value={applications[activeApplication].progress}
                sx={{ mb: 2, height: 8, borderRadius: 4 }}
              />

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                Required Documents
              </Typography>

              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Document</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications[activeApplication].documents.map((doc, index) => (
                      <TableRow key={index}>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(doc.status)}
                            label={doc.status}
                            color={getStatusColor(doc.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {doc.status !== 'Not Uploaded' ? (
                            <Tooltip title="View Document">
                              <IconButton size="small">
                                <RemoveRedEye />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Upload Document">
                              <IconButton size="small" color="primary">
                                <CloudUpload />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* All Applications */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            All Applications
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Application ID</TableCell>
                  <TableCell>Scholarship</TableCell>
                  <TableCell>Submitted Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((app, index) => (
                  <TableRow
                    key={app.id}
                    selected={index === activeApplication}
                    hover
                    onClick={() => setActiveApplication(index)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{app.id}</TableCell>
                    <TableCell>{app.scholarshipName}</TableCell>
                    <TableCell>{app.submittedDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={app.status}
                        color={getStatusColor(app.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LinearProgress
                          variant="determinate"
                          value={app.progress}
                          sx={{ flexGrow: 1, mr: 1 }}
                        />
                        <Typography variant="body2">
                          {app.progress}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <RemoveRedEye />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Applications; 