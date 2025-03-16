import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorIcon from '@mui/icons-material/Error';
import { useAuth } from '@/lib/auth';

interface ApplicationStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
}

interface RecentApplication {
  id: string;
  studentName: string;
  submissionDate: string;
  status: 'pending' | 'verified' | 'rejected';
  documentCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch dashboard data from backend
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, applicationsResponse] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/recent-applications'),
        ]);
        const [statsData, applicationsData] = await Promise.all([
          statsResponse.json(),
          applicationsResponse.json(),
        ]);
        setStats(statsData);
        setRecentApplications(applicationsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {loading ? (
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          ) : stats ? (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Total Applications
                    </Typography>
                    <Typography variant="h4">{stats.total}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="warning.main" gutterBottom>
                      Pending Review
                    </Typography>
                    <Typography variant="h4">{stats.pending}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="success.main" gutterBottom>
                      Verified
                    </Typography>
                    <Typography variant="h4">{stats.verified}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="error.main" gutterBottom>
                      Rejected
                    </Typography>
                    <Typography variant="h4">{stats.rejected}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </>
          ) : null}
        </Grid>

        {/* Recent Applications Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Recent Applications</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/admin/verify')}
            >
              View All Applications
            </Button>
          </Box>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Submission Date</TableCell>
                  <TableCell>Documents</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentApplications.map((application) => (
                  <TableRow key={application.id} hover>
                    <TableCell>{application.studentName}</TableCell>
                    <TableCell>
                      {new Date(application.submissionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{application.documentCount} documents</TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(application.status)}
                        label={application.status.toUpperCase()}
                        color={getStatusColor(application.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/admin/verify/${application.id}`)}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
} 