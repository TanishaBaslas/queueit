import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminDashboard() {
    const [queueData, setQueueData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const QUEUE_ID =
        localStorage.getItem("queueId") ||
        "6a6f3ce5073f0abdb5d7da79";

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const fetchStats = async () => {
        try {
            const res = await axios.get(
                `${API}/api/stats/queue/${QUEUE_ID}`,
                { headers }
            );

            setQueueData(res.data);
            setError("");
        } catch (err) {
            console.log(err);
            setError(
                err.response?.data?.message ||
                "Cannot load dashboard"
            );
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleAction = async (action) => {
        try {
            setLoading(true);

            const method = action === "walkin" ? "post" : "patch";

            const res = await axios[method](
                `${API}/api/admin/queues/${QUEUE_ID}/${action}`,
                {},
                { headers }
            );

            alert(res.data.message);
            fetchStats();

        } catch (err) {
            console.log(err.response);

            alert(
                err.response?.data?.message ||
                "Action failed"
            );

        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return <h2>Please login first</h2>;
    }

    if (error) {
        return (
            <div>
                <h2>Error</h2>
                <p>{error}</p>

                <button onClick={fetchStats}>
                    Retry
                </button>
            </div>
        );
    }

    if (!queueData) {
        return <h2>Loading dashboard...</h2>;
    }

    return (
        <div style={{ padding: "40px" }}>
            <h1>Admin Dashboard</h1>

            <h2>
                {queueData.queueName}
            </h2>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    marginTop: "30px"
                }}
            >
                <Card
                    title="Now Serving"
                    value={queueData.nowServing}
                />

                <Card
                    title="Waiting"
                    value={queueData.waitingCount}
                />

                <Card
                    title="Served"
                    value={queueData.servedCount}
                />

                <Card
                    title="Status"
                    value={
                        queueData.isActive
                            ? "Active"
                            : "Paused"
                    }
                />
            </div>

            <h3 style={{ marginTop: "40px" }}>
                Queue Controls
            </h3>

            <div
                style={{
                    display: "flex",
                    gap: "15px"
                }}
            >
                <button
                    disabled={loading}
                    onClick={() => handleAction("serve")}
                >
                    Serve Next
                </button>

                <button
                    disabled={loading}
                    onClick={() => handleAction("skip")}
                >
                    Skip
                </button>

                <button
                    disabled={loading}
                    onClick={() => handleAction("pause")}
                >
                    Pause / Resume
                </button>

                <button
                    disabled={loading}
                    onClick={() => handleAction("walkin")}
                >
                    Add Walk-in
                </button>
            </div>
        </div>
    );
}

function Card({ title, value }) {
    return (
        <div
            style={{
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "12px",
                minWidth: "130px",
                textAlign: "center"
            }}
        >
            <h3>{title}</h3>
            <h2>{value}</h2>
        </div>
    );
}

export default AdminDashboard;