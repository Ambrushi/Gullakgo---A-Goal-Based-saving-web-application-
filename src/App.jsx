import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import GoalCreation from './pages/GoalCreation';
import GoalDetail from './pages/GoalDetail';
import ExpenseTracker from './pages/ExpenseTracker';
import AICoach from './pages/AICoach';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected layout wrapper checking authentication state
function ProtectedLayout({ children }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing & Auth Pages */}
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Onboarding Flow */}
      <Route path="/onboarding" element={<Onboarding />} />
      
      {/* Authenticated Dashboard & App Views */}
      <Route
        path="/"
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        }
      />

      <Route
        path="/goals/new"
        element={
          <ProtectedLayout>
            <GoalCreation />
          </ProtectedLayout>
        }
      />

      <Route
        path="/goals/:id"
        element={
          <ProtectedLayout>
            <GoalDetail />
          </ProtectedLayout>
        }
      />

      <Route
        path="/goals"
        element={
          <ProtectedLayout>
            <ProfilePage />
          </ProtectedLayout>
        }
      />

      <Route
        path="/expenses"
        element={
          <ProtectedLayout>
            <ExpenseTracker />
          </ProtectedLayout>
        }
      />

      <Route
        path="/ai-coach"
        element={
          <ProtectedLayout>
            <AICoach />
          </ProtectedLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedLayout>
            <ProfilePage />
          </ProtectedLayout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3500} hideProgressBar={false} theme="colored" />
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
