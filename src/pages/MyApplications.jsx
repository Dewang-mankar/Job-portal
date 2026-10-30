
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getApplications } from "../services/api";
import { useAuth } from "../context/AuthContext";

function MyApplications() {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch logged-in user's applications
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await getApplications();

                const myApplications = response.data.filter(
                    (application) =>
                        application.email?.trim().toLowerCase() ===
                        user.email.trim().toLowerCase()
                );

                setApplications(myApplications);
            } catch (error) {
                console.error("Error fetching applications:", error);
                toast.error("Unable to load your applications.");
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) {
            setLoading(true);
            fetchApplications();
        } else {
            setApplications([]);
            setLoading(false);
        }
    }, [user]);

    // Show success message after submission
    useEffect(() => {
        if (location.state?.applicationSubmitted) {
            toast.success("Application submitted successfully!");

            navigate(location.pathname, {
                replace: true,
                state: {}
            });
        }
    }, [location, navigate]);

    return (
        <div className="container py-5">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>My Applications</h2>
                    <p className="text-muted">
                        Track all your job applications here.
                    </p>
                </div>

                <Link to="/jobs" className="btn btn-primary">
                    Browse Jobs
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary">
                    </div>
                    <p className="mt-3">Loading applications...</p>
                </div>
            ) : applications.length === 0 ? (
                <div className="text-center py-5">
                    <h4>No Applications Yet</h4>
                    <p className="text-muted">
                        You haven't applied for any jobs yet.
                    </p>

                    <Link to="/jobs" className="btn btn-primary">
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <>
                    <h5 className="mb-3">
                        Total Applications: {applications.length}
                    </h5>

                    <div className="row">
                        {applications.map((application) => (
                            <div
                                className="col-md-6 col-lg-4 mb-4"
                                key={application.id}
                            >
                                <div className="card p-4 shadow-sm h-100">

                                    <h5>{application.jobTitle}</h5>

                                    <p className="text-muted mb-2">
                                        {application.company}
                                    </p>

                                    <hr />

                                    <p className="mb-2">
                                        <strong>Applicant:</strong>{" "}
                                        {application.name}
                                    </p>

                                    <p className="mb-2">
                                        <strong>Email:</strong>{" "}
                                        {application.email}
                                    </p>

                                    <p className="mb-3">
                                        <strong>Applied Date:</strong>{" "}
                                        {application.appliedDate}
                                    </p>

                                    <div>
                                        <strong>Status: </strong>

                                        <span className="badge bg-warning text-dark">
                                            {application.status || "Pending"}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

        </div>
    );
}

export default MyApplications;
