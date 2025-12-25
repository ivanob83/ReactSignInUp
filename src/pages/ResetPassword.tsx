import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "@/firebase";
import { FirebaseError } from "firebase/app";

type FormData = {
    password: string;
    confirmPassword: string;
};

export default function ResetPassword() {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const oobCode = searchParams.get("oobCode");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        mode: "onTouched",
        criteriaMode: "all",
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setError(null);
        setMessage(null);

        if (!oobCode) {
            setError("Invalid password reset link.");
            return;
        }

        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await confirmPasswordReset(auth, oobCode, data.password);
            setMessage("Password successfully reset! You can now login.");
            setTimeout(() => {
                navigate("/signin");
            }, 3000);
        } catch (err) {
            if (err instanceof FirebaseError) {
                setError(err.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="form-container">
            <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="form-title">Reset Password</h2>
                <p className="form-subtitle">Enter your new password below.</p>

                {message && <div className="text-success mb-2">{message}</div>}
                {error && <div className="error-message mb-2">{error}</div>}

                <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter new password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Minimum 8 characters",
                            },
                        })}
                    />
                    {errors.password && (
                        <div className="error-message">
                            {errors.password.message}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Confirm new password"
                        {...register("confirmPassword", {
                            required: "Confirm your password",
                        })}
                    />
                    {errors.confirmPassword && (
                        <div className="error-message">
                            {errors.confirmPassword.message}
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    Reset Password
                </button>

                <div className="sign-up mt-4 mx-2">
                    Back to
                    <Link to="/signin" className="mx-2">
                        Sign In
                    </Link>
                </div>
            </form>
        </div>
    );
}
