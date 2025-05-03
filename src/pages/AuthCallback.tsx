import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
            const fetchToken = async () => {
                try {
                    const response = await fetch(
                        "http://localhost:5000/auth/google/callback"
                    );
                    if (!response.ok) {
                        throw new Error("Authentication failed");
                    }
                    const data = await response.json();
                    // console.log("Received data:", data);
                    const { token, user } = data;

                    console.log("Received token:", token);
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));

                    navigate("/");
                } catch (error) {
                    console.error("Error fetching auth token:", error);
                    navigate("/login");
                }
            };

            fetchToken();
        }, [navigate]);

    return <p>Authenticating...</p>;
};

export default AuthCallback;
