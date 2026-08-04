import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";

const API = import.meta.env.VITE_API_URL || "https://queueit-backend-oaib.onrender.com";

function QueueStatus() {

    const { id } = useParams();

    const [status, setStatus] = useState(null);


    useEffect(() => {

        const fetchStatus = async () => {

            try {

                const res = await axios.get(
                    `${API}/api/queues/${id}/status`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                setStatus(res.data);


            } catch(error) {

                console.log(error);

            }

        };


        fetchStatus();


        socket.emit(
            "joinQueueRoom",
            id
        );


        const handleUpdate = (data) => {

            console.log(
                "Live update received",
                data
            );


            setStatus(prev => {

                if (!prev) {
                    return prev;
                }


                return {
                    ...prev,
                    ...data
                };

            });

        };


        socket.on(
            "queueUpdated",
            handleUpdate
        );


        return () => {

            socket.off(
                "queueUpdated",
                handleUpdate
            );

        };


    }, [id]);


    if (!status) {
        return <h2>Loading...</h2>;
    }


    return (

        <div style={styles.container}>

            <h1>
                Live Queue Status
            </h1>


            <div style={styles.card}>

                <h2>
                    {status.queueName}
                </h2>


                <p>
                    🎫 Your Token:
                    <b> #{status.yourToken}</b>
                </p>


                <p>
                    🔥 Now Serving:
                    <b> #{status.nowServing}</b>
                </p>


                <p>
                    👥 People Ahead:
                    <b>{status.peopleAhead}</b>
                </p>


                <p>
                    ⏳ Estimated Wait:
                    <b>
                        {" "}
                        {Math.ceil(status.estimatedWaitTime / 60)}
                        {" "}minutes
                    </b>
                </p>


                <h3>
                    Status: {status.status}
                </h3>


            </div>

        </div>

    );

}


const styles = {

    container: {
        padding: "30px"
    },

    card: {
        padding: "25px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        width: "350px"
    }

};


export default QueueStatus;