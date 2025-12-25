import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";
import { FirebaseError } from "firebase/app";
export default function ForgotPassword() {
    type FormData = {
        email: string;
    };

    const actionCodeSettings = {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
    };

    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        mode: "onTouched",
        criteriaMode: "all",
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setError(null);
        setMessage(null);
        try {
            await sendPasswordResetEmail(auth, data.email, actionCodeSettings);
            setMessage("Password reset email sent! Check your inbox.");
        } catch (err) {
            if (err instanceof FirebaseError) {
                setError(err.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };
    return (
        <>
            <div className="form-container">
                <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="form-title">Forgot Pasword</h2>
                    <p className="form-subtitle">
                        Enter your email and we’ll send you a password reset
                        link.
                    </p>

                    {message && (
                        <div className="text-success mb-2">{message}</div>
                    )}
                    {error && <div className="error-message mb-2">{error}</div>}

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

                    <button type="submit" className="btn btn-primary w-100">
                        Submit
                    </button>
                    <div className="sign-up mt-4 mx-2">
                        Go back to
                        <Link to="/signin" className="mx-2">
                            Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}
