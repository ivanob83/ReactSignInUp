import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "@/store/authSlice";

export const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await signOut(auth); // Firebase logout
            dispatch(clearUser()); // Redux store clear
            navigate("/signin"); // Navigate to signin
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <button
            onClick={logout}
            className="btn btn-link text-decoration-none text-primary"
        >
            Logout
        </button>
    );
};
