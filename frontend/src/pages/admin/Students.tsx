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
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

interface Student {
  id: string;
  name: string;
  email: string;
  institution: string;
  course: string;
  status: 'active' | 'inactive' | 'pending';
  documents: number;
  applications: number;
}

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    institution: 'University of Technology',
    course: 'Computer Science',
    status: 'active',
    documents: 3,
    applications: 2,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    institution: 'Engineering College',
    course: 'Electrical Engineering',
    status: 'pending',
    documents: 1,
    applications: 0,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    institution: 'Science University',
    course: 'Physics',
    status: 'inactive',
    documents: 2,
    applications: 1,
  },
];

const Students: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
    setIsEditing(false);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
    setIsEditing(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
    setIsEditing(false);
  };

  const handleStatusUpdate = (status: 'active' | 'inactive') => {
    if (selectedStudent) {
      setStudents(students.map(student =>
        student.id === selectedStudent.id
          ? { ...student, status }
          : student
      ));
      handleCloseDialog();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Student Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Institution</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Documents</TableCell>
              <TableCell>Applications</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.institution}</TableCell>
                <TableCell>{student.course}</TableCell>
                <TableCell>
                  <Chip
                    label={student.status.toUpperCase()}
                    color={getStatusColor(student.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{student.documents}</TableCell>
                <TableCell>{student.applications}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewStudent(student)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditStudent(student)}
                      >
                        <EditIcon />
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
          {isEditing ? 'Edit Student' : 'Student Details'} - {selectedStudent?.name}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={selectedStudent?.name || ''}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={selectedStudent?.email || ''}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Institution"
                value={selectedStudent?.institution || ''}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course"
                value={selectedStudent?.course || ''}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Statistics
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip
                  label={`${selectedStudent?.documents || 0} Documents`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={`${selectedStudent?.applications || 0} Applications`}
                  color="secondary"
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {isEditing ? (
            <Button variant="contained" color="primary">
              Save Changes
            </Button>
          ) : (
            <>
              {selectedStudent?.status === 'active' ? (
                <Button
                  color="error"
                  startIcon={<BlockIcon />}
                  onClick={() => handleStatusUpdate('inactive')}
                >
                  Deactivate
                </Button>
              ) : (
                <Button
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleStatusUpdate('active')}
                >
                  Activate
                </Button>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Students; 