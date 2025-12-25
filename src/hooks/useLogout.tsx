import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/authSlice";

export const useLogout = () => {
    const dispatch = useDispatch();

    const logout = async () => {
        try {
            await signOut(auth); // Firebase logout
            dispatch(clearUser()); // Redux store clear
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return logout;
};
