import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./QueueJoin.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function QueueJoin() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);

    const joinQueue = async () => {

        try {

            setLoading(true);

            const authToken = localStorage.getItem("token");

            if (!authToken) {

                alert("Please login first");

                navigate("/login");

                return;

            }

            const response = await axios.post(
                `${API}/api/queues/${id}/join`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );


            console.log(
                "Join Response:",
                response.data
            );


            setToken(
                response.data.tokenNumber
            );


            localStorage.setItem(
                "queueId",
                id
            );


            console.log(
                "Queue saved:",
                id
            );


        } catch(error) {

            console.log(
                "JOIN ERROR:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Unable to join queue"
            );


        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="join-page">

            <div className="join-card">

                {
                    !token ?

                    (

                        <>

                            <div className="logo">
                                QueueIt
                            </div>


                            <h1>
                                Join Queue
                            </h1>


                            <p>
                                Get your digital token and track your waiting time.
                            </p>


                            <button
                                onClick={joinQueue}
                                disabled={loading}
                            >

                                {
                                    loading
                                    ? "Joining..."
                                    : "Join Queue"
                                }

                            </button>


                        </>

                    )

                    :

                    (

                        <>

                            <div className="success">
                                ✓
                            </div>


                            <h1>
                                Successfully Joined
                            </h1>


                            <p>
                                Your queue token is:
                            </p>


                            <div className="token">
                                #{token}
                            </div>


                            <button
                                onClick={() =>
                                    navigate(`/queue/${id}/status`)
                                }
                            >
                                View Live Status →
                            </button>


                        </>

                    )
                }

            </div>

        </div>

    );
}

export default QueueJoin;