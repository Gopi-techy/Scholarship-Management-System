import { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Description as DescriptionIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { scholarshipService, applicationService, userService } from '../../services';

interface DashboardStats {
  totalStudents: number;
  totalScholarships: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
}

interface RecentActivity {
  id: string;
  type: 'application' | 'user' | 'scholarship';
  title: string;
  status: 'approved' | 'pending' | 'rejected';
  date: string;
}

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalScholarships: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all required data
        const [students, scholarships, applications] = await Promise.all([
          userService.getAllUsers(),
          scholarshipService.getAllScholarships(),
          applicationService.getApplications(),
        ]);

        // Calculate stats
        const pendingApplications = applications.filter((app: any) => app.status === 'pending').length;
        const approvedApplications = applications.filter((app: any) => app.status === 'approved').length;
        const rejectedApplications = applications.filter((app: any) => app.status === 'rejected').length;

        setStats({
          totalStudents: students.length,
          totalScholarships: scholarships.length,
          totalApplications: applications.length,
          pendingApplications,
          approvedApplications,
          rejectedApplications,
        });

        // Get recent activity
        const activity = [
          ...applications.map((app: any) => ({
            id: app.id,
            type: 'application' as const,
            title: `Application for ${app.scholarshipId}`,
            status: app.status as 'approved' | 'pending' | 'rejected',
            date: new Date(app.submittedAt).toLocaleDateString(),
          })),
          ...students.slice(0, 3).map((student: any) => ({
            id: student.id,
            type: 'user' as const,
            title: `New student registration: ${student.name}`,
            status: 'approved' as const,
            date: new Date(student.createdAt).toLocaleDateString(),
          })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
         .slice(0, 5);

        setRecentActivity(activity);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon color="success" />;
      case 'pending':
        return <PendingIcon color="warning" />;
      case 'rejected':
        return <WarningIcon color="error" />;
      default:
        return <PendingIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {currentUser?.email || 'Admin'}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Students</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {stats.totalStudents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Scholarships</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {stats.totalScholarships}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Applications</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {stats.totalApplications}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PendingIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Pending Applications</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {stats.pendingApplications}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Approved Applications</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {stats.approvedApplications}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <WarningIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Rejected Applications</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {stats.rejectedApplications}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentActivity.map((activity) => (
                <ListItem key={activity.id}>
                  <ListItemIcon>
                    {getStatusIcon(activity.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.title}
                    secondary={`Status: ${activity.status.charAt(0).toUpperCase() + activity.status.slice(1)} • ${activity.date}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 