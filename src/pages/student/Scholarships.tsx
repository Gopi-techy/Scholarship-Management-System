import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search,
  School,
  AccessTime,
  AttachMoney,
  Info,
  FilterList,
} from '@mui/icons-material';

const Scholarships: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock data - replace with actual API calls
  const scholarships = [
    {
      id: 1,
      title: 'Merit Scholarship',
      description: 'For students with outstanding academic achievements',
      amount: 10000,
      deadline: '2024-04-21',
      requirements: ['Minimum GPA 3.5', 'Letter of Recommendation', 'Academic Transcript'],
      type: 'Academic',
      status: 'Open',
    },
    {
      id: 2,
      title: 'Need-based Scholarship',
      description: 'Financial assistance for students from low-income backgrounds',
      amount: 15000,
      deadline: '2024-05-05',
      requirements: ['Income Certificate', 'Academic Transcript', 'Statement of Need'],
      type: 'Financial Aid',
      status: 'Open',
    },
    {
      id: 3,
      title: 'Research Grant',
      description: 'Supporting innovative research projects in various fields',
      amount: 20000,
      deadline: '2024-05-20',
      requirements: ['Research Proposal', 'Faculty Recommendation', 'Academic Transcript'],
      type: 'Research',
      status: 'Open',
    },
  ];

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || scholarship.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Available Scholarships
      </Typography>

      {/* Search and Filter Section */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search scholarships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Filter by Type</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Filter by Type"
              startAdornment={
                <InputAdornment position="start">
                  <FilterList />
                </InputAdornment>
              }
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="Academic">Academic</MenuItem>
              <MenuItem value="Financial Aid">Financial Aid</MenuItem>
              <MenuItem value="Research">Research</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Scholarships Grid */}
      <Grid container spacing={3}>
        {filteredScholarships.map((scholarship) => {
          const daysRemaining = getDaysRemaining(scholarship.deadline);
          const progress = Math.max(0, Math.min(100, (30 - daysRemaining) / 30 * 100));

          return (
            <Grid item xs={12} md={6} lg={4} key={scholarship.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <School sx={{ mr: 1 }} color="primary" />
                    <Typography variant="h6" component="div">
                      {scholarship.title}
                    </Typography>
                  </Box>

                  <Typography color="text.secondary" paragraph>
                    {scholarship.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AttachMoney sx={{ mr: 1 }} color="success" />
                    <Typography variant="subtitle1">
                      ${scholarship.amount.toLocaleString()}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTime sx={{ mr: 1 }} color={daysRemaining < 7 ? 'error' : 'warning'} />
                    <Typography>
                      {daysRemaining} days remaining
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ mb: 2, height: 8, borderRadius: 4 }}
                  />

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={scholarship.type}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={scholarship.status}
                      color="success"
                      size="small"
                    />
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Requirements:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                    {scholarship.requirements.map((req, index) => (
                      <Typography
                        component="li"
                        variant="body2"
                        color="text.secondary"
                        key={index}
                      >
                        {req}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{ mr: 1 }}
                  >
                    Apply Now
                  </Button>
                  <Tooltip title="View Details">
                    <IconButton color="primary">
                      <Info />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Scholarships; 