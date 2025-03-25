import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

interface DocumentUploadProps {
  onUpload: (files: File[]) => void;
  onDelete?: (fileName: string) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
}

const DocumentUpload = ({
  onUpload,
  onDelete,
  acceptedFileTypes = ['.pdf', '.jpg', '.jpeg', '.png'],
  maxFileSize = 5 * 1024 * 1024, // 5MB default
}: DocumentUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    // Validate file types
    const invalidFiles = selectedFiles.filter(
      file => !acceptedFileTypes.some(type => file.name.toLowerCase().endsWith(type))
    );

    if (invalidFiles.length > 0) {
      toast.error(`Invalid file type. Accepted types: ${acceptedFileTypes.join(', ')}`);
      return;
    }

    // Validate file size
    const oversizedFiles = selectedFiles.filter(file => file.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      toast.error(`File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`);
      return;
    }

    setFiles(prev => [...prev, ...selectedFiles]);
    onUpload(selectedFiles);
  };

  const handleDelete = (fileName: string) => {
    setFiles(prev => prev.filter(file => file.name !== fileName));
    if (onDelete) {
      onDelete(fileName);
    }
  };

  return (
    <Box>
      <input
        accept={acceptedFileTypes.join(',')}
        style={{ display: 'none' }}
        id="document-upload"
        multiple
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="document-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
          disabled={uploading}
        >
          Upload Documents
        </Button>
      </label>

      {files.length > 0 && (
        <List sx={{ mt: 2 }}>
          {files.map((file) => (
            <ListItem
              key={file.name}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(file.name)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={`${(file.size / 1024).toFixed(2)} KB`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default DocumentUpload; 