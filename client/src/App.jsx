import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Login from "./pages/Login";
import AuthSuccess from "./pages/AuthSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import AnalyticsPage from "./pages/AnalyticsPage";
import Home from "./pages/Home";
import QueueJoin from "./pages/QueueJoin";
import QueueStatus from "./pages/QueueStatus";

import "./App.css";


function App() {

    return (

        <BrowserRouter>

            <nav className="navbar">

                <div className="navbar-logo">
                    QueueIt
                </div>


                <div className="nav-links">

                    <Link to="/">
                        Home
                    </Link>


                    <Link to="/admin">
                        Admin
                    </Link>


                    <Link to="/analytics">
                        Analytics
                    </Link>


                    <Link to="/notifications">

                        <span className="notification">
                            🔔 Notifications
                        </span>

                    </Link>

                </div>

            </nav>


            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />


                <Route
                    path="/join/:id"
                    element={<QueueJoin />}
                />


                <Route
                    path="/queue/:id/status"
                    element={<QueueStatus />}
                />


                <Route
                    path="/login"
                    element={<Login />}
                />


                <Route
                    path="/auth-success"
                    element={<AuthSuccess />}
                />


                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />


                <Route
                    path="/analytics"
                    element={<AnalyticsPage />}
                />

            </Routes>

        </BrowserRouter>

    );

}


export default App;