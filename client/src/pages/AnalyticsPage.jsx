import { useState, useEffect } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AnalyticsPage() {
    const [stats, setStats] = useState(null);

    const token = localStorage.getItem("token");

    const QUEUE_ID =
        localStorage.getItem("queueId") ||
        "6a6f3ce5073f0abdb5d7da79";

    const fetchStats = async () => {
        try {
            const res = await axios.get(
                `${API}/api/stats/queue/${QUEUE_ID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setStats(res.data);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (!stats) {
        return <h2>Loading analytics...</h2>;
    }

    const statusData = [
        {
            name: "Served",
            value: stats.servedCount
        },
        {
            name: "Skipped",
            value: stats.skippedCount
        },
        {
            name: "Waiting",
            value: stats.waitingCount
        }
    ];

    const hourlyData = Object.entries(
        stats.hourlyBreakdown || {}
    ).map(([hour, count]) => ({
        hour: `${hour}:00`,
        joins: count
    }));

    return (
        <div style={{ padding: "30px" }}>

            <h1>
                Analytics - {stats.queueName}
            </h1>

            <div
                style={{
                    display: "flex",
                    gap: "20px"
                }}
            >
                <Card
                    title="Total Joined"
                    value={stats.totalJoined}
                />

                <Card
                    title="Average Time"
                    value={`${stats.avgServiceTimeSeconds}s`}
                />

                <Card
                    title="Peak Hour"
                    value={stats.peakHour}
                />
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

                    <h3>Hourly Joins</h3>

                    <ResponsiveContainer>

                        <BarChart data={hourlyData}>

                            <XAxis dataKey="hour" />

                            <YAxis />

                            <Tooltip />

                            <Bar dataKey="joins" />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </div>

        </div>
    );
}


function Card({ title, value }) {
    return (
        <div
            style={{
                border: "1px solid #ddd",
                padding: "20px",
                borderRadius: "10px"
            }}
        >

            <h3>{title}</h3>

            <h2>{value}</h2>

        </div>
    );
}


export default AnalyticsPage;