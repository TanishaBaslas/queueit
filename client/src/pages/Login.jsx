const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Login() {

    const login = () => {
        window.location.href = `${API}/auth/google`;
    };

    return (
        <div
            style={{
                minHeight: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >

            <div
                style={{
                    background: "white",
                    padding: "40px",
                    borderRadius: "20px",
                    textAlign: "center"
                }}
            >

                <h1>
                    Login to QueueIt
                </h1>

                <p>
                    Continue with Google
                </p>

                <button
                    onClick={login}
                    style={{
                        padding: "14px 30px",
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer"
                    }}
                >
                    Continue with Google
                </button>

            </div>

        </div>
    );
}

export default Login;