import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { setUser, clearUser } from "@/store/authSlice";

const AuthListener = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await user.getIdToken();
                dispatch(setUser({ uid: user.uid, email: user.email!, token }));
            } else {
                dispatch(clearUser());
            }
        });

        return () => unsubscribe(); // cleanup on unmount
    }, [dispatch]);

    return null; // ne renderuje ništa
};

export default AuthListener;
