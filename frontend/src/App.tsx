import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from '@/lib/theme';
import { AuthProvider } from '@/lib/auth';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import StudentDashboard from './pages/student/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import DocumentVerification from './pages/admin/DocumentVerification';
import DocumentAnalysis from './components/DocumentAnalysis';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/student/*"
              element={
                <ProtectedRoute role="student">
                  <Routes>
                    <Route path="/" element={<StudentDashboard />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute role="admin">
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/verify" element={<DocumentVerification />} />
                    <Route path="/analyze" element={<DocumentAnalysis />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MainLayout>
      </AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ThemeProvider>
  );
};

export default App; 