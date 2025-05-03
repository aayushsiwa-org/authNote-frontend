import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import NotFound from "./pages/404";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import AuthCallback from "./pages/AuthCallback";

function App() {
    const { token } = useAuth();

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={token ? <Home /> : <Navigate to="/login" />}
                />

                <Route path="/auth/callback" element={<AuthCallback />} />

                <Route
                    path="/signup"
                    element={!token ? <SignUp /> : <Navigate to="/" />}
                />
                <Route
                    path="/login"
                    element={!token ? <Login /> : <Navigate to="/" />}
                />
                <Route
                    path="/forgot-password"
                    element={!token ? <ForgotPassword /> : <Navigate to="/" />}
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
