import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Logout } from "@/hooks/useLogout";

export const Navbar = () => {
    const currentUser = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    const getInitial = () => {
        return currentUser.email
            ? currentUser.email.charAt(0).toUpperCase()
            : "";
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <div className="container-fluid">
                <img
                    src="/src/assets/react.svg"
                    alt="ReactAuth"
                    className="navbar-brand"
                    style={{ height: "40px" }}
                />
                <div className="d-flex align-items-center gap-2">
                    {currentUser.isLoggedIn ? (
                        <>
                            <div
                                className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    fontWeight: "bold",
                                }}
                                title={currentUser.email}
                            >
                                {getInitial()}
                            </div>
                            <Logout />
                        </>
                    ) : (
                        <button
                            className="btn btn-link text-decoration-none text-primary"
                            onClick={() => navigate("/signin")}
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};
