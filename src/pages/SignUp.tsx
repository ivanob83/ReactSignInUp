import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@/assets/google.svg";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase";
import { FirebaseError } from "firebase/app";
import { setUser } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import type { SubmitHandler } from "react-hook-form";

export default function SignUp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [authError, setAuthError] = useState<string | null>(null);
    type FormData = {
        email: string;
        password: string;
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        mode: "onTouched",
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );
            const user = userCredential.user;
            const token = await user.getIdToken();

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
                setAuthError(error.message);
            } else {
                setAuthError("Something went wrong. Please try again.");
            }
        }
    };

    const handleGoogleAuth = async () => {
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
                setAuthError(error.message);
            } else {
                setAuthError("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <>
            <div className="form-container">
                <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="form-title">Create Account</h2>

                    <p className="form-subtitle">
                        Start your 30-day free trial today
                    </p>

                    {authError && (
                        <div className="error-message">{authError}</div>
                    )}

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
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Create account
                    </button>
                    <div className="sign-up mt-4 mx-2">
                        Already have an account?
                        <Link to="/signin" className="mx-2">
                            Sign In
                        </Link>
                    </div>

                    <div className="divider">or</div>

                    <div className="d-grid gap-2 mb-4">
                        <button
                            type="button"
                            className="btn social-btn"
                            onClick={handleGoogleAuth}
                        >
                            <span className="button-icon">
                                <img src={GoogleIcon} />
                            </span>
                            Continue with Google
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
