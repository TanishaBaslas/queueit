import { useState, useEffect } from 'react';
import axios from 'axios';

const QUEUE_ID = '6a64f3f1bc1cc676e2cf432d'; // hardcoded for now, testing
const API_BASE = 'http://localhost:5000/api/admin';

function AdminDashboard() {
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token'); // login se milega baad mein

  const fetchStats = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/stats/queue/${QUEUE_ID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQueueData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      const method = action === 'walkin' ? 'post' : 'patch';
      await axios[method](`${API_BASE}/queues/${QUEUE_ID}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchStats(); // refresh after action
    } catch (err) {
      console.error(err);
      alert('Action failed. Check console.');
    }
    setLoading(false);
  };

  if (!queueData) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Admin Dashboard — {queueData.queueName}</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={cardStyle}>Now Serving: <b>{queueData.nowServing}</b></div>
        <div style={cardStyle}>Waiting: <b>{queueData.waitingCount}</b></div>
        <div style={cardStyle}>Served: <b>{queueData.servedCount}</b></div>
        <div style={cardStyle}>Status: <b>{queueData.isActive ? 'Active' : 'Paused'}</b></div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button disabled={loading} onClick={() => handleAction('serve')}>Serve Next</button>
        <button disabled={loading} onClick={() => handleAction('skip')}>Skip</button>
        <button disabled={loading} onClick={() => handleAction('pause')}>
          {queueData.isActive ? 'Pause' : 'Resume'}
        </button>
        <button disabled={loading} onClick={() => handleAction('walkin')}>Add Walk-in</button>
      </div>
    </div>
  );
}

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '1rem',
  minWidth: '120px',
  textAlign: 'center'
};

export default AdminDashboard;