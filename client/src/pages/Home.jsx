import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Home() {
    const [queues, setQueues] = useState([]);
    const [loading, setLoading] = useState(true);

    const queueSection = useRef(null);

    useEffect(() => {
        const fetchQueues = async () => {
            try {
                const response = await axios.get(
                    `${API}/api/queues`
                );

                setQueues(response.data);

            } catch (error) {
                console.log(
                    "Error fetching queues:",
                    error
                );

            } finally {
                setLoading(false);
            }
        };

        fetchQueues();

    }, []);

    const exploreQueues = () => {
        queueSection.current?.scrollIntoView({
            behavior: "smooth"
        });
    };

    return (
        <div className="home">

            <section className="hero">

                <h1>
                    Smart Queue Management with{" "}
                    <span>
                        QueueIt
                    </span>
                </h1>

                <p>
                    Join queues digitally, track your position,
                    and save your valuable time.
                </p>

                <button onClick={exploreQueues}>
                    Explore Queues
                </button>

            </section>


            <section
                ref={queueSection}
                className="queue-section"
            >

                <h2 className="section-title">
                    Available Queues
                </h2>


                {
                    loading ? (

                        <p>
                            Loading queues...
                        </p>

                    ) : queues.length === 0 ? (

                        <p>
                            No active queues available.
                        </p>

                    ) : (

                        <div className="cards">

                            {
                                queues.map((queue) => (

                                    <div
                                        className="card"
                                        key={queue._id}
                                    >

                                        <h2>
                                            {queue.name}
                                        </h2>


                                        <p className="location">
                                            📍{" "}
                                            {
                                                queue.venueId?.name ||
                                                "Venue"
                                            }
                                        </p>


                                        <div className="details">

                                            <span>
                                                👥 Waiting:
                                                <b>
                                                    {" "}
                                                    {queue.queue?.length || 0}
                                                </b>
                                            </span>


                                            <span>
                                                ⏳ Avg Time:
                                                <b>
                                                    {" "}
                                                    {
                                                        Math.floor(
                                                            queue.averageServiceTime / 60
                                                        )
                                                    }
                                                    {" "}min
                                                </b>
                                            </span>

                                        </div>


                                        <Link
                                            to={`/join/${queue._id}`}
                                        >

                                            <button className="join">
                                                Join Queue →
                                            </button>

                                        </Link>

                                    </div>

                                ))
                            }

                        </div>

                    )
                }

            </section>

        </div>
    );
}

export default Home;