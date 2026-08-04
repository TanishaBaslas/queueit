import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import LoginPage from './pages/LoginPage';

function AuthSuccess() {
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/');
    }
  }, [navigate]);
  return <p>Logging in...</p>;
}

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      {isLoggedIn && (
        <nav style={{ padding: '1rem', background: '#333', display: 'flex', gap: '1.5rem' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/analytics" style={{ color: 'white', textDecoration: 'none' }}>Analytics</Link>
        </nav>
      )}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/" element={isLoggedIn ? <AdminDashboard /> : <LoginPage />} />
        <Route path="/analytics" element={isLoggedIn ? <AnalyticsPage /> : <LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;