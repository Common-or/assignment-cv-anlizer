import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadResume from './pages/UploadResume';
import ResumeAnalysis from './pages/ResumeAnalysis';
import JobMatcher from './pages/JobMatcher';
import History from './pages/History';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="upload" element={<UploadResume />} />
            <Route path="analysis/:resumeId" element={<ResumeAnalysis />} />
            <Route path="jobs" element={<JobMatcher />} />
            <Route path="history" element={<History />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
