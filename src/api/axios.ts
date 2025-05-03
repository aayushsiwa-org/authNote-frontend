import axios, { AxiosError } from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_MODE === "production"
            ? import.meta.env.VITE_BE_URL // Use deployed URL in production
            : "http://localhost:5000", // Use local server in development
    timeout: 10000,
});

interface RegisterValues {
    username: string;
    email: string;
    password: string;
}

interface LoginValues {
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
    user?: {
        id: string;
        email: string;
        name: string;
    };
}

interface ApiError {
    message: string;
    details?: Record<string, string | null>;
}

export const register = async (
    values: RegisterValues
): Promise<AuthResponse> => {
    try {
        const res = await api.post<AuthResponse>("/auth/register", values);
        const { token } = res.data;
        if (!token) {
            throw new Error("No token received from server");
        }
        localStorage.setItem("token", token);
        window.location.href = "/";
        return res.data;
    } catch (err) {
        const error = err as AxiosError<ApiError>;
        console.error("Registration error:", error.response?.data || error);
        const errorMsg =
            error.response?.data?.message ||
            error.response?.statusText ||
            "Registration failed";
        throw new Error(errorMsg);
    }
};

export const login = async (values: LoginValues): Promise<AuthResponse> => {
    try {
        const res = await api.post<AuthResponse>("/auth/login", values);
        const { token } = res.data;
        if (!token) {
            throw new Error("No token received from server");
        }
        localStorage.setItem("token", token);
        console.log("Login successful, token stored");
        window.location.href = "/";
        return res.data;
    } catch (err) {
        const error = err as AxiosError<ApiError>;
        console.error("Login error:", error.response?.data || error);
        const errorMsg =
            error.response?.data?.message ||
            error.response?.statusText ||
            "Login failed";
        throw new Error(errorMsg);
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
};

export const isLoggedIn = (): boolean => {
    return !!localStorage.getItem("token");
};

export const getToken = (): string | null => {
    return localStorage.getItem("token");
};

export const debugToken = (): void => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.log("No token found in localStorage");
        return;
    }
    console.log("Token exists in localStorage");
    const tokenPreview = `${token.substring(0, 15)}...${token.substring(
        token.length - 10
    )}`;
    console.log(`Token preview: ${tokenPreview}`);
    console.log(`Token length: ${token.length}`);
};

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
        ) {
            console.error(
                "Authentication error:",
                error.response.status,
                error.response.data
            );
            if (!window.location.pathname.includes("/login")) {
                console.log("Authentication failed, redirecting to login");
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
