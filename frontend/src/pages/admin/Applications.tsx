import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

interface Application {
  id: string;
  studentName: string;
  scholarshipName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  documents: string[];
}

const mockApplications: Application[] = [
  {
    id: '1',
    studentName: 'John Doe',
    scholarshipName: 'Merit Scholarship',
    status: 'pending',
    submittedDate: '2024-02-15',
    documents: ['transcript.pdf', 'recommendation.pdf'],
  },
  {
    id: '2',
    studentName: 'Jane Smith',
    scholarshipName: 'Need-based Scholarship',
    status: 'approved',
    submittedDate: '2024-02-14',
    documents: ['financial_statement.pdf', 'tax_returns.pdf'],
  },
  {
    id: '3',
    studentName: 'Mike Johnson',
    scholarshipName: 'Research Grant',
    status: 'rejected',
    submittedDate: '2024-02-13',
    documents: ['research_proposal.pdf', 'budget_plan.pdf'],
  },
];

const Applications: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [remarks, setRemarks] = useState('');

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedApplication(null);
    setRemarks('');
  };

  const handleStatusUpdate = (status: 'approved' | 'rejected') => {
    if (selectedApplication) {
      setApplications(applications.map(app =>
        app.id === selectedApplication.id
          ? { ...app, status }
          : app
      ));
      handleCloseDialog();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Scholarship Applications
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Scholarship</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submitted Date</TableCell>
              <TableCell>Documents</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>{application.studentName}</TableCell>
                <TableCell>{application.scholarshipName}</TableCell>
                <TableCell>
                  <Chip
                    label={application.status.toUpperCase()}
                    color={getStatusColor(application.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(application.submittedDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {application.documents.map((doc, index) => (
                      <Tooltip key={index} title={doc}>
                        <IconButton size="small">
                          <DescriptionIcon />
                        </IconButton>
                      </Tooltip>
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title="View Application">
                    <IconButton
                      color="primary"
                      onClick={() => handleViewApplication(application)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Application Details - {selectedApplication?.studentName}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Scholarship: {selectedApplication?.scholarshipName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Submitted: {selectedApplication && new Date(selectedApplication.submittedDate).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Documents
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {selectedApplication?.documents.map((doc, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    startIcon={<DescriptionIcon />}
                    size="small"
                  >
                    {doc}
                  </Button>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {selectedApplication?.status === 'pending' && (
            <>
              <Button
                color="error"
                startIcon={<CloseIcon />}
                onClick={() => handleStatusUpdate('rejected')}
              >
                Reject
              </Button>
              <Button
                color="success"
                startIcon={<CheckIcon />}
                onClick={() => handleStatusUpdate('approved')}
              >
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Applications; 