import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function AuthSuccess() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);
            navigate("/");
        }
    }, [params, navigate]);

    return <h2>Logging in...</h2>;
}

export default AuthSuccess;