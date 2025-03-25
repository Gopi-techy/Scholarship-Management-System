import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  uploadDate: string;
}

interface ApplicationStatus {
  status: 'not_started' | 'in_progress' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  lastUpdated: string;
  documents: Document[];
  timeline: {
    date: string;
    status: string;
    description: string;
  }[];
}

export default function ApplicationStatus() {
  const [status, setStatus] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/student/application-status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching application status:', error);
      toast.error('Failed to fetch application status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'verified':
        return 'success';
      case 'under_review':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <VerifiedUserIcon />;
      case 'rejected':
        return <ErrorIcon />;
      default:
        return <PendingIcon />;
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'not_started':
        return 0;
      case 'in_progress':
        return 25;
      case 'submitted':
        return 50;
      case 'under_review':
        return 75;
      case 'approved':
      case 'rejected':
        return 100;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  if (!status) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No Application Found
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/student/application')}
            >
              Start Application
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Application Status
        </Typography>

        <Grid container spacing={3}>
          {/* Status Overview */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={status.status.replace('_', ' ').toUpperCase()}
                    color={getStatusColor(status.status) as any}
                    sx={{ mb: 1 }}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={getProgressValue(status.status)}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Last updated: {new Date(status.lastUpdated).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Documents Status */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Document Status
              </Typography>
              <List>
                {status.documents.map((doc) => (
                  <div key={doc.id}>
                    <ListItem>
                      <ListItemIcon>{getStatusIcon(doc.status)}</ListItemIcon>
                      <ListItemText
                        primary={doc.name}
                        secondary={
                          <>
                            {doc.status === 'rejected' && doc.rejectionReason ? (
                              <Typography
                                component="span"
                                variant="body2"
                                color="error"
                              >
                                Reason: {doc.rejectionReason}
                              </Typography>
                            ) : (
                              `Uploaded on ${new Date(
                                doc.uploadDate
                              ).toLocaleDateString()}`
                            )}
                          </>
                        }
                      />
                      <Chip
                        label={doc.status.toUpperCase()}
                        color={getStatusColor(doc.status) as any}
                        size="small"
                      />
                    </ListItem>
                    <Divider />
                  </div>
                ))}
              </List>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<UploadFileIcon />}
                  onClick={() => navigate('/student/documents')}
                >
                  Manage Documents
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Application Timeline */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Application Timeline
              </Typography>
              <Timeline>
                {status.timeline.map((event, index) => (
                  <TimelineItem key={index}>
                    <TimelineOppositeContent color="text.secondary">
                      {new Date(event.date).toLocaleDateString()}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot
                        color={getStatusColor(event.status) as any}
                      />
                      {index < status.timeline.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="h6">{event.status}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.description}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 