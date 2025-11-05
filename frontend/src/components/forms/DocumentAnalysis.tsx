import React, { useState } from 'react';
import { documentService } from '../../services';
import { Box, Button, TextField, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface AnalysisResult {
  confidence: number;
  fields: Record<string, any>;
}

const DocumentAnalysis: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [documentUrl, setDocumentUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setDocumentUrl('');
      setResult(null);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentUrl(event.target.value);
    setFile(null);
    setResult(null);
  };

  const handleAnalyzeFile = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      const response = await documentService.analyzeDocument(file);
      setResult(response.data.analysis);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze document');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeUrl = async () => {
    if (!documentUrl) return;

    try {
      setLoading(true);
      setError(null);
      const response = await documentService.analyzeDocumentUrl(documentUrl);
      setResult(response.data.analysis);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Document Analysis
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Upload Document
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Choose File
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg"
            />
          </Button>
          {file && (
            <Typography variant="body2">
              Selected: {file.name}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          onClick={handleAnalyzeFile}
          disabled={!file || loading}
        >
          Analyze File
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Analyze from URL
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Document URL"
            value={documentUrl}
            onChange={handleUrlChange}
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={handleAnalyzeUrl}
            disabled={!documentUrl || loading}
          >
            Analyze URL
          </Button>
        </Box>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Analysis Results
          </Typography>
          <Typography variant="body2" gutterBottom>
            Confidence: {(result.confidence * 100).toFixed(2)}%
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Extracted Fields:
            </Typography>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {JSON.stringify(result.fields, null, 2)}
            </pre>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default DocumentAnalysis; 