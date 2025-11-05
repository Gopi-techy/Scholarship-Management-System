import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Alert,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Container,
  Stack,
  Skeleton,
  DialogContentText,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { documentService } from '../../services';
import { toast } from 'react-toastify';

interface StudentDocument {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  documentType: 'academic' | 'financial' | 'identity' | 'other';
  description?: string;
  analysis?: {
    text: string;
    confidence: number;
    entities: any[];
    extractedFields?: {
      [key: string]: string;
    };
  };
  verificationDetails?: {
    verifiedBy: {
      name: string;
      email: string;
    };
    verifiedAt: string;
    remarks?: string;
  };
}

const StudentDocumentUpload: React.FC = () => {
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [previewDialog, setPreviewDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<StudentDocument | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, [filterType, filterStatus]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterType) params.append('documentType', filterType);
      if (filterStatus) params.append('status', filterStatus);
      
      const response = await documentService.getDocuments(params.toString());
      setDocuments(response as unknown as StudentDocument[]);
    } catch (error) {
      setError('Failed to fetch documents');
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('application/pdf|image/*')) {
      setError('Please upload a PDF or image file');
      toast.error('Please upload a PDF or image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      toast.error('File size should be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setOpenDialog(true);
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) return;

    try {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('documentType', documentType);
      if (description) formData.append('description', description);

      const response = await documentService.uploadDocument(formData);
      setDocuments((prev) => [response as unknown as StudentDocument, ...prev]);
      toast.success('Document uploaded successfully');
      
      // Reset form
      setSelectedFile(null);
      setDocumentType('');
      setDescription('');
      setOpenDialog(false);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to upload document';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      await documentService.deleteDocument(documentId);
      setDocuments((prev) => prev.filter((doc) => doc._id !== documentId));
      toast.success('Document deleted successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete document';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handlePreview = (document: StudentDocument) => {
    setSelectedDocument(document);
    setPreviewDialog(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon color="success" />;
      case 'rejected':
        return <CancelIcon color="error" />;
      default:
        return <PendingIcon color="warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Upload Document
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box
                component="input"
                accept="application/pdf,image/*"
                sx={{ display: 'none' }}
                id="document-upload"
                type="file"
                onChange={handleFileSelect}
                disabled={uploading}
                ref={fileInputRef}
                aria-label="Upload document"
              />
              <Button
                variant="contained"
                component="label"
                htmlFor="document-upload"
                startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
                disabled={uploading}
                sx={{ mb: 1 }}
              >
                {uploading ? 'Uploading...' : 'Select Document'}
              </Button>
              <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                Supported formats: PDF, JPG, PNG (Max size: 10MB)
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Paper sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <FilterIcon color="action" />
            <Typography variant="h6">Filters</Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={filterType}
                  label="Document Type"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="academic">Academic</MenuItem>
                  <MenuItem value="financial">Financial</MenuItem>
                  <MenuItem value="identity">Identity</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="verified">Verified</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            My Documents
          </Typography>
          {loading ? (
            <Stack spacing={2}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" height={100} />
              ))}
            </Stack>
          ) : (
            <List>
              {documents.map((document) => (
                <ListItem key={document._id} divider>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DescriptionIcon color="primary" />
                        {document.fileName}
                        <Chip
                          icon={getStatusIcon(document.status)}
                          label={document.status}
                          color={getStatusColor(document.status)}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {formatFileSize(document.fileSize)} • {new Date(document.uploadedAt).toLocaleDateString()}
                        </Typography>
                        {document.description && (
                          <Typography variant="body2" color="text.secondary">
                            {document.description}
                          </Typography>
                        )}
                        {document.verificationDetails && (
                          <Typography variant="body2" color="text.secondary">
                            Verified by: {document.verificationDetails.verifiedBy.name} on{' '}
                            {new Date(document.verificationDetails.verifiedAt).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label={`Preview ${document.fileName}`}
                      onClick={() => handlePreview(document)}
                      sx={{ mr: 1 }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label={`Delete ${document.fileName}`}
                      onClick={() => handleDelete(document._id)}
                      disabled={uploading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {documents.length === 0 && (
                <ListItem>
                  <ListItemText primary="No documents uploaded yet" />
                </ListItem>
              )}
            </List>
          )}
        </Paper>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={documentType}
                  label="Document Type"
                  onChange={(e) => setDocumentType(e.target.value)}
                  required
                >
                  <MenuItem value="academic">Academic</MenuItem>
                  <MenuItem value="financial">Financial</MenuItem>
                  <MenuItem value="identity">Identity</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Description (Optional)"
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ mb: 2 }}
              />
              {selectedFile && (
                <Typography variant="body2" color="text.secondary">
                  Selected file: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              onClick={handleUpload}
              variant="contained"
              disabled={!documentType || uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={previewDialog}
          onClose={() => setPreviewDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Document Preview</DialogTitle>
          <DialogContent>
            {selectedDocument && (
              <Box>
                <DialogContentText gutterBottom>
                  <strong>File Name:</strong> {selectedDocument.fileName}
                </DialogContentText>
                <DialogContentText gutterBottom>
                  <strong>Type:</strong> {selectedDocument.documentType}
                </DialogContentText>
                <DialogContentText gutterBottom>
                  <strong>Status:</strong>{' '}
                  <Chip
                    icon={getStatusIcon(selectedDocument.status)}
                    label={selectedDocument.status}
                    color={getStatusColor(selectedDocument.status)}
                    size="small"
                  />
                </DialogContentText>
                {selectedDocument.description && (
                  <DialogContentText gutterBottom>
                    <strong>Description:</strong> {selectedDocument.description}
                  </DialogContentText>
                )}
                <Box sx={{ mt: 2 }}>
                  {selectedDocument.fileType.startsWith('image/') ? (
                    <Box
                      component="img"
                      src={selectedDocument.fileUrl}
                      alt={selectedDocument.fileName}
                      sx={{ maxWidth: '100%', maxHeight: '70vh' }}
                    />
                  ) : (
                    <Box
                      component="iframe"
                      src={selectedDocument.fileUrl}
                      sx={{ width: '100%', height: '70vh', border: 'none' }}
                      title={selectedDocument.fileName}
                    />
                  )}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Container>
  );
};

export default StudentDocumentUpload; 