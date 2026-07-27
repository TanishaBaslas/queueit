import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const QUEUE_ID = '6a64f3f1bc1cc676e2cf432d';
const COLORS = ['#4CAF50', '#FF9800', '#2196F3'];

function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem('token');

  const fetchStats = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/stats/queue/${QUEUE_ID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) return <p>Loading analytics...</p>;

  // Data for status breakdown pie chart
  const statusData = [
    { name: 'Served', value: stats.servedCount },
    { name: 'Skipped', value: stats.skippedCount },
    { name: 'Waiting', value: stats.waitingCount }
  ];

  // Data for hourly breakdown bar chart
  const hourlyData = Object.entries(stats.hourlyBreakdown).map(([hour, count]) => ({
    hour: `${hour}:00`,
    joins: count
  }));

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Analytics — {stats.queueName}</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={cardStyle}>Total Joined: <b>{stats.totalJoined}</b></div>
        <div style={cardStyle}>Avg Service Time: <b>{stats.avgServiceTimeSeconds}s</b></div>
        <div style={cardStyle}>Peak Hour: <b>{stats.peakHour}</b></div>
      </div>

      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        <div style={{ width: 350, height: 300 }}>
          <h3>Status Breakdown</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90} label>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ width: 400, height: 300 }}>
          <h3>Joins by Hour</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <XAxis dataKey="hour" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="joins" fill="#2196F3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '1rem',
  minWidth: '150px',
  textAlign: 'center'
};

export default AnalyticsPage;