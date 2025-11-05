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
  School as SchoolIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { scholarshipService, applicationService } from '../../services';

interface DashboardStats {
  totalScholarships: number;
  activeApplications: number;
  approvedApplications: number;
  pendingApplications: number;
}

interface RecentActivity {
  id: string;
  type: 'application' | 'scholarship';
  title: string;
  status: 'approved' | 'pending' | 'rejected';
  date: string;
}

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalScholarships: 0,
    activeApplications: 0,
    approvedApplications: 0,
    pendingApplications: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch scholarships
        const scholarships = await scholarshipService.getAllScholarships();
        
        // Fetch applications
        const applications = await applicationService.getApplications();
        
        // Calculate stats
        const activeApplications = applications.filter((app: any) => app.status === 'pending').length;
        const approvedApplications = applications.filter((app: any) => app.status === 'approved').length;
        const pendingApplications = applications.filter((app: any) => app.status === 'pending').length;

        setStats({
          totalScholarships: scholarships.length,
          activeApplications,
          approvedApplications,
          pendingApplications,
        });

        // Get recent activity
        const activity = applications.map((app: any) => ({
          id: app.id,
          type: 'application' as const,
          title: `Application for ${app.scholarshipId}`,
          status: app.status as 'approved' | 'pending' | 'rejected',
          date: new Date(app.submittedAt).toLocaleDateString(),
        }));

        setRecentActivity(activity.slice(0, 5)); // Show only 5 most recent activities
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
        Welcome, {currentUser?.email || 'Student'}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Available Scholarships</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {stats.totalScholarships}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Applications</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {stats.activeApplications}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Approved</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {stats.approvedApplications}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PendingIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Pending</Typography>
              </Box>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {stats.pendingApplications}
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