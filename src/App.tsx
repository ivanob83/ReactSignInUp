import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useLogout } from "@/hooks/useLogout";

function App() {
    const currentUser = useSelector((state: RootState) => state.auth);
    const logout = useLogout();
    return (
        <>
            <div>
                {currentUser.isLoggedIn ? (
                    <div>
                        Logged in as {currentUser.email}{" "}
                        <button onClick={logout} className="btn btn-secondary">
                            Logout
                        </button>
                    </div>
                ) : (
                    <span>Not logged in</span>
                )}
            </div>
            <Routes>
                <Route path="/" element={<Navigate to="/signin" />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>{" "}
        </>
    );
}

export default App;
