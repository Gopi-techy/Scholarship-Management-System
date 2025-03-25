import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

interface Scholarship {
  id: string;
  name: string;
  description: string;
  amount: string;
  deadline: string;
  status: 'active' | 'inactive' | 'closed';
  applicants: number;
  requirements: string[];
}

const mockScholarships: Scholarship[] = [
  {
    id: '1',
    name: 'Merit Scholarship',
    description: 'Awarded to students with outstanding academic performance.',
    amount: '$5,000',
    deadline: '2024-05-01',
    status: 'active',
    applicants: 25,
    requirements: ['Minimum GPA of 3.8', 'Letter of recommendation'],
  },
  {
    id: '2',
    name: 'Need-based Scholarship',
    description: 'Financial assistance for students with demonstrated financial need.',
    amount: '$3,000',
    deadline: '2024-05-15',
    status: 'active',
    applicants: 15,
    requirements: ['Financial statement', 'Income tax returns'],
  },
  {
    id: '3',
    name: 'Research Grant',
    description: 'Support for students conducting research in STEM fields.',
    amount: '$7,500',
    deadline: '2024-06-01',
    status: 'closed',
    applicants: 8,
    requirements: ['Research proposal', 'Faculty recommendation'],
  },
];

const Scholarships: React.FC = () => {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState<Scholarship[]>(mockScholarships);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateScholarship = () => {
    setSelectedScholarship(null);
    setIsCreating(true);
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleViewScholarship = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    setOpenDialog(true);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleEditScholarship = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    setOpenDialog(true);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedScholarship(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleStatusUpdate = (status: 'active' | 'inactive' | 'closed') => {
    if (selectedScholarship) {
      setScholarships(scholarships.map(scholarship =>
        scholarship.id === selectedScholarship.id
          ? { ...scholarship, status }
          : scholarship
      ));
      handleCloseDialog();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'closed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">
          Scholarship Programs
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateScholarship}
        >
          Create Scholarship
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Applicants</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scholarships.map((scholarship) => (
              <TableRow key={scholarship.id}>
                <TableCell>{scholarship.name}</TableCell>
                <TableCell>{scholarship.amount}</TableCell>
                <TableCell>{new Date(scholarship.deadline).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    label={scholarship.status.toUpperCase()}
                    color={getStatusColor(scholarship.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{scholarship.applicants}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewScholarship(scholarship)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditScholarship(scholarship)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleStatusUpdate('closed')}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
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
          {isCreating
            ? 'Create New Scholarship'
            : isEditing
            ? 'Edit Scholarship'
            : 'Scholarship Details'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={selectedScholarship?.name || ''}
                disabled={!isEditing && !isCreating}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={selectedScholarship?.description || ''}
                disabled={!isEditing && !isCreating}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                value={selectedScholarship?.amount || ''}
                disabled={!isEditing && !isCreating}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Deadline"
                value={selectedScholarship?.deadline || ''}
                disabled={!isEditing && !isCreating}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth disabled={!isEditing && !isCreating}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedScholarship?.status || 'active'}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {!isCreating && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Requirements
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedScholarship?.requirements.map((req, index) => (
                    <Chip
                      key={index}
                      label={req}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {(isEditing || isCreating) ? (
            <Button variant="contained" color="primary">
              {isCreating ? 'Create' : 'Save Changes'}
            </Button>
          ) : (
            <Button
              color="primary"
              onClick={() => handleEditScholarship(selectedScholarship!)}
            >
              Edit
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Scholarships; 