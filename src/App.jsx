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
      
      {/* Global Glowing Blobs (Background) */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>

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
