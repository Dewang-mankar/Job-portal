
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));

        setMessage("");
    };

    const validateForm = () => {
        const newErrors = {};

        const email = form.email.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            newErrors.email = "Email is required.";
        } else if (!emailPattern.test(email)) {
            newErrors.email = "Enter a valid email address.";
        }

        if (!form.password) {
            newErrors.password = "Password is required.";
        } else if (/\s/.test(form.password)) {
            newErrors.password = "Password must not contain spaces.";
        } else if (form.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters.";
        } else if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])/.test(
                form.password
            )
        ) {
            newErrors.password =
                "Use uppercase, lowercase, a number, and a symbol.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");

        if (!validateForm()) return;

        const email = form.email.trim().toLowerCase();

        const success = login(email, form.password);

        if (!success) {
            setMessage("Invalid email or password. Please try again.");
            return;
        }

        // Handle the built-in admin account.
        if (email === "admin@gmail.com") {
            navigate("/admin", { replace: true });
            return;
        }

        // Find the registered account.
        const users = JSON.parse(
            localStorage.getItem("hireflow_users") || "[]"
        );

        const loggedInUser = users.find(
            (account) => account.email?.toLowerCase() === email
        );

        // Recruiters go to the admin dashboard.
        if (loggedInUser?.role === "recruiter") {
            navigate("/admin", { replace: true });
            return;
        }

        // Candidates return to the page they originally requested.
        const destination = location.state?.from || "/";

        navigate(destination, { replace: true });
    };


    return (
        <div className="container py-5">
            <div
                className="card shadow-sm mx-auto p-4"
                style={{ maxWidth: "450px", borderRadius: "14px" }}
            >
                <h2 className="text-center fw-bold mb-2">Welcome Back!</h2>
                <p className="text-center text-muted mb-4">
                    Login to continue your HireFlow journey.
                </p>

                {message && (
                    <div className="alert alert-danger" role="alert">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            className={`form-control ${errors.email ? "is-invalid" : ""
                                }`}
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                        {errors.email && (
                            <div className="invalid-feedback">
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>

                        <div className="input-group">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className={`form-control ${errors.password ? "is-invalid" : ""
                                    }`}
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    setShowPassword((prev) => !prev)
                                }
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        {errors.password && (
                            <div className="text-danger small mt-1">
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 fw-semibold mt-2"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center mt-4 mb-0">
                    Don't have an account?{" "}
                    <Link to="/register" className="fw-semibold">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
