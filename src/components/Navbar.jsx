
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = () => {
        const confirmed = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmed) return;

        logout();
        toast.success("Logged out successfully!");
        navigate("/", { replace: true });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            <Link className="navbar-brand fw-bold" to="/">
                HireFlow
            </Link>

            <div className="ms-auto d-flex align-items-center gap-3 flex-wrap">
                <Link className="nav-link text-white" to="/">
                    Home
                </Link>

                <Link className="nav-link text-white" to="/jobs">
                    Jobs
                </Link>

                <Link className="nav-link text-white" to="/about">
                    About Us
                </Link>

                {user ? (
                    <>
                        <Link
                            className="nav-link text-white"
                            to={user.role === "recruiter" ? "/admin" : "/dashboard"}
                        >
                            Dashboard
                        </Link>

                        {user.role !== "recruiter" && (
                            <Link
                                className="nav-link text-white"
                                to="/applications"
                            >
                                My Applications
                            </Link>
                        )}

                        <span className="text-white">
                            Hi, {user.name}
                        </span>

                        <button
                            className="btn btn-danger"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link className="nav-link text-white" to="/login">
                            Login
                        </Link>

                        <Link className="btn btn-primary" to="/register">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;