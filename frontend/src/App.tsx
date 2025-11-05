import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './lib/theme';

// Public Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';

// Student Pages
import StudentHome from './pages/student/Home';
import StudentDashboard from './pages/student/Dashboard';
import Scholarships from './pages/student/Scholarships';
import Applications from './pages/student/Applications';
import Documents from './pages/student/Documents';
import Profile from './pages/student/Profile';
import ApplicationStatus from './pages/student/ApplicationStatus';

// Admin Pages
import AdminHome from './pages/admin/Home';
import AdminDashboard from './pages/admin/Dashboard';
import AdminApplications from './pages/admin/Applications';
import AdminScholarships from './pages/admin/Scholarships';
import AdminStudents from './pages/admin/Students';
import DocumentVerification from './pages/admin/DocumentVerification';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentHome />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="scholarships" element={<Scholarships />} />
          <Route path="applications" element={<Applications />} />
          <Route path="documents" element={<Documents />} />
          <Route path="profile" element={<Profile />} />
          <Route path="application-status" element={<ApplicationStatus />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminHome />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="scholarships" element={<AdminScholarships />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="document-verification" element={<DocumentVerification />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;