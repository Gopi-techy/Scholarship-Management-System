import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Document } from '../../types';

interface ExtendedDocument extends Document {
  name: string;
  studentName: string;
  uploadDate: string;
  verificationScore?: number;
}

const DocumentVerification: React.FC = () => {
  const [documents, setDocuments] = useState<ExtendedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<ExtendedDocument | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/admin/documents');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (document: ExtendedDocument) => {
    setSelectedDocument(document);
    setVerificationStatus('pending');
    setRemarks('');
    setDialogOpen(true);
  };

  const handleVerificationSubmit = async () => {
    if (!selectedDocument) return;

    try {
      // Update document status - replace with actual API call
      const updatedDocuments = documents.map((doc) =>
        doc._id === selectedDocument._id
          ? {
              ...doc,
              status: verificationStatus,
              remarks,
            }
          : doc
      );

      setDocuments(updatedDocuments);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error updating document status:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'studentName', headerName: 'Student Name', flex: 1 },
    { field: 'name', headerName: 'Document Name', flex: 1 },
    { field: 'type', headerName: 'Type', flex: 1 },
    {
      field: 'uploadDate',
      headerName: 'Upload Date',
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        const status = params.value as string;
        const getStatusProps = () => {
          switch (status) {
            case 'verified':
              return {
                icon: <VerifiedUserIcon />,
                color: 'success' as const,
              };
            case 'rejected':
              return {
                icon: <ErrorIcon />,
                color: 'error' as const,
              };
            default:
              return {
                icon: <PendingIcon />,
                color: 'warning' as const,
              };
          }
        };

        const { icon, color } = getStatusProps();
        return (
          <Chip
            icon={icon}
            label={status.toUpperCase()}
            color={color}
            size="small"
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const document = params.row as ExtendedDocument;
        return (
          <Box>
            <Button
              size="small"
              color="primary"
              onClick={() => handleVerify(document)}
              disabled={document.status !== 'pending'}
            >
              Verify
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Document Verification
        </Typography>

        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Documents
                </Typography>
                <Typography variant="h4">{documents.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="warning.main" gutterBottom>
                  Pending Verification
                </Typography>
                <Typography variant="h4">
                  {documents.filter((doc) => doc.status === 'pending').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="success.main" gutterBottom>
                  Verified Documents
                </Typography>
                <Typography variant="h4">
                  {documents.filter((doc) => doc.status === 'verified').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Documents Table */}
          <Grid item xs={12}>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              {loading ? (
                <LinearProgress />
              ) : (
                <DataGrid
                  rows={documents}
                  columns={columns}
                  autoHeight
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 },
                    },
                  }}
                  disableRowSelectionOnClick
                />
              )}
            </Paper>
          </Grid>
        </Grid>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Verify Document</DialogTitle>
          <DialogContent>
            <Box mt={2}>
              <TextField
                select
                fullWidth
                label="Verification Status"
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value as 'pending' | 'verified' | 'rejected')}
                margin="normal"
              >
                <MenuItem value="verified">Verified</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </TextField>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleVerificationSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default DocumentVerification; 