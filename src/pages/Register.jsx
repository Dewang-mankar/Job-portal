import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        age: "",
        location: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const validate = () => {
        const newErrors = {};

        if (!/^[A-Za-z][A-Za-z\s'-]*$/.test(form.firstName.trim())) {
            newErrors.firstName = "Enter a valid first name.";
        }

        if (!/^[A-Za-z][A-Za-z\s'-]*$/.test(form.lastName.trim())) {
            newErrors.lastName = "Enter a valid last name.";
        }

        if (!/^[6-9]\d{9}$/.test(form.phone)) {
            newErrors.phone = "Enter a valid 10-digit Indian mobile number.";
        }

        const age = Number(form.age);

        if (!form.age || !Number.isInteger(age) || age < 18 || age > 100) {
            newErrors.age = "Age must be between 18 and 100.";
        }

        if (form.location.trim().length < 2) {
            newErrors.location = "Enter your current location.";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Enter a valid email address.";
        }

        if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,}$/.test(
                form.password
            )
        ) {
            newErrors.password =
                "Use 8+ characters with uppercase, lowercase, a digit and a symbol.";
        }

        if (form.confirmPassword !== form.password) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone" && !/^\d{0,10}$/.test(value)) {
            return;
        }

        if (name === "age" && !/^\d{0,3}$/.test(value)) {
            return;
        }

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: ""
        }));

        setMessage("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");

        if (!validate()) return;

        const fullName =
            `${form.firstName.trim()} ${form.lastName.trim()}`;

        const success = register(
            fullName,
            form.email.trim().toLowerCase(),
            form.password,
            {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                phone: form.phone,
                age: Number(form.age),
                location: form.location.trim()
            }
        );

        if (success) {
            navigate("/login");
        } else {
            setMessage("An account with this email or phone number already exists.");
        }
    };

    const fieldClass = (field) =>
        `form-control ${errors[field] ? "is-invalid" : ""}`;

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-7">

                    <div className="card border-0 shadow-lg register-card">
                        <div className="card-body p-4 p-md-5">

                            <div className="text-center mb-4">
                                <span className="register-icon">👤</span>

                                <h2 className="fw-bold mt-3">
                                    Create Your Account
                                </h2>

                                <p className="text-secondary">
                                    Join HireFlow and find your next opportunity.
                                </p>

                                <span className="badge bg-primary-subtle text-primary px-3 py-2">
                                    Candidate Registration
                                </span>
                            </div>

                            {message && (
                                <div className="alert alert-danger">
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} noValidate>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            First Name *
                                        </label>

                                        <input
                                            name="firstName"
                                            className={fieldClass("firstName")}
                                            value={form.firstName}
                                            onChange={handleChange}
                                            placeholder="Enter first name"
                                            autoComplete="given-name"
                                            required
                                        />

                                        {errors.firstName && (
                                            <div className="invalid-feedback">
                                                {errors.firstName}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Last Name *
                                        </label>

                                        <input
                                            name="lastName"
                                            className={fieldClass("lastName")}
                                            value={form.lastName}
                                            onChange={handleChange}
                                            placeholder="Enter last name"
                                            autoComplete="family-name"
                                            required
                                        />

                                        {errors.lastName && (
                                            <div className="invalid-feedback">
                                                {errors.lastName}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-7 mb-3">
                                        <label className="form-label">
                                            Phone Number *
                                        </label>

                                        <input
                                            type="tel"
                                            name="phone"
                                            className={fieldClass("phone")}
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="10-digit mobile number"
                                            inputMode="numeric"
                                            maxLength={10}
                                            autoComplete="tel-national"
                                            required
                                        />

                                        {errors.phone && (
                                            <div className="invalid-feedback">
                                                {errors.phone}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-5 mb-3">
                                        <label className="form-label">
                                            Age *
                                        </label>

                                        <input
                                            type="number"
                                            name="age"
                                            className={fieldClass("age")}
                                            value={form.age}
                                            onChange={handleChange}
                                            placeholder="Your age"
                                            min="18"
                                            max="100"
                                            required
                                        />

                                        {errors.age && (
                                            <div className="invalid-feedback">
                                                {errors.age}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Current Location *
                                    </label>

                                    <input
                                        name="location"
                                        className={fieldClass("location")}
                                        value={form.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Nagpur, Maharashtra"
                                        autoComplete="address-level2"
                                        required
                                    />

                                    {errors.location && (
                                        <div className="invalid-feedback">
                                            {errors.location}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Email Address *
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        className={fieldClass("email")}
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        required
                                    />

                                    {errors.email && (
                                        <div className="invalid-feedback">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Password *
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        className={fieldClass("password")}
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Create a strong password"
                                        autoComplete="new-password"
                                        required
                                    />

                                    {errors.password && (
                                        <div className="invalid-feedback">
                                            {errors.password}
                                        </div>
                                    )}

                                    <small className="text-secondary">
                                        Minimum 8 characters, uppercase, lowercase,
                                        number and symbol.
                                    </small>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">
                                        Confirm Password *
                                    </label>

                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className={fieldClass("confirmPassword")}
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter your password"
                                        autoComplete="new-password"
                                        required
                                    />

                                    {errors.confirmPassword && (
                                        <div className="invalid-feedback">
                                            {errors.confirmPassword}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg w-100"
                                >
                                    Create Candidate Account
                                </button>

                            </form>

                            <p className="text-center text-secondary mt-4 mb-0">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="fw-semibold text-decoration-none"
                                >
                                    Login
                                </Link>
                            </p>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Register;