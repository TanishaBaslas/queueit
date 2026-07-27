import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', background: '#333', display: 'flex', gap: '1.5rem' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/analytics" style={{ color: 'white', textDecoration: 'none' }}>Analytics</Link>
      </nav>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;