import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@/assets/google.svg";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase";
import { FirebaseError } from "firebase/app";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import type { SubmitHandler } from "react-hook-form";
import {
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
} from "firebase/auth";

type FormData = {
    email: string;
    password: string;
    rememberMe: boolean;
};

export default function SignIn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [authError, setAuthError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        mode: "onTouched",
        criteriaMode: "all",
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setAuthError(null); // reset
        try {
            const rememberMe = data.rememberMe;
            await setPersistence(
                auth,
                rememberMe ? browserLocalPersistence : browserSessionPersistence
            );
            const userCredential = await signInWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );

            const user = userCredential.user;
            const token = await user.getIdToken();

            dispatch(setUser({ uid: user.uid, email: user.email!, token }));

            navigate("/dashboard");
        } catch (error) {
            if (error instanceof FirebaseError) {
                setAuthError(error.message);
            } else {
                setAuthError("Something went wrong. Please try again.");
            }
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const token = await user.getIdToken();

            // Save user in Redux
            dispatch(
                setUser({
                    uid: user.uid,
                    email: user.email!,
                    token,
                })
            );

            navigate("/dashboard");
        } catch (error) {
            if (error instanceof FirebaseError) {
                setAuthError("Google login error:", error.message);
            } else {
                setAuthError("Something went wrong. Please try again.");
            }
        }
    };
    return (
        <div className="form-container">
            <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="form-title">Sign In</h2>

                {authError && <div className="error-message">{authError}</div>}

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                message: "Invalid email address",
                            },
                        })}
                    />
                    {errors.email && (
                        <div className="error-message">
                            {errors.email.message}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Choose a password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message:
                                    "Password must be at least 8 characters",
                            },
                        })}
                    />
                    {errors.password && (
                        <div className="error-message">
                            {errors.password.message}
                        </div>
                    )}

                    <div className="sign-up mt-0 text-end form-label">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                </div>

                <div className="mb-4">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="rememberMe"
                        {...register("rememberMe")}
                    />
                    <label
                        className="form-check-label mx-2 form-label"
                        htmlFor="rememberMe"
                    >
                        Remember Me
                    </label>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    Sign In
                </button>

                <div className="sign-up mt-4 form-label">
                    Don't have an account?
                    <Link to="/signup" className="mx-2">
                        Create One
                    </Link>
                </div>

                <div className="divider">or</div>

                <div className="d-grid gap-2 mb-4">
                    <button
                        type="button"
                        className="btn social-btn"
                        onClick={handleGoogleLogin}
                    >
                        <span className="button-icon">
                            <img src={GoogleIcon} />
                        </span>
                        Continue with Google
                    </button>
                </div>
            </form>
        </div>
    );
}
