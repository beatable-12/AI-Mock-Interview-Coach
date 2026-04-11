import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layout
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';

function AppLayout() {
  const { currentUser } = useAuth();

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] overflow-hidden text-white relative">
      
      {/* Global Glowing Blobs — layered depth */}
      <div className="absolute top-[-15%] right-[-8%] w-[45%] h-[45%] bg-indigo-600/25 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-15%] left-[-8%] w-[55%] h-[55%] bg-violet-700/15 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-fuchsia-700/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />

      <Toaster position="top-right" toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)'
          }
      }} />

      {/* Conditionally render sidebar only if logged in */}
      {currentUser && <Sidebar />}
      
      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative z-10 scroll-smooth">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/about" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/interview" element={
            <ProtectedRoute>
              <Interview />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
