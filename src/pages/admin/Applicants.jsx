import { useEffect, useState } from "react";
import { getApplications, updateJob } from "../../services/api";
import axios from "axios";

const API_URL = "http://localhost:3000";

function Applicants() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchApplications = async () => {
        try {
            const response = await getApplications();
            setApplications(response.data);
            setError("");
        } catch {
            setError("Unable to load applicants. Check JSON Server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const changeStatus = async (applicationId, status) => {
        try {
            await axios.patch(
                `${API_URL}/applications/${applicationId}`,
                { status }
            );

            setApplications((previous) =>
                previous.map((application) =>
                    String(application.id) === String(applicationId)
                        ? { ...application, status }
                        : application
                )
            );
        } catch {
            setError("Unable to update application status.");
        }
    };

    const statusClass = (status) => {
        switch (status) {
            case "Selected":
                return "bg-success";
            case "Rejected":
                return "bg-danger";
            case "Shortlisted":
                return "bg-primary";
            default:
                return "bg-warning text-dark";
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <h1 className="fw-bold">Applicants Management</h1>
            <p className="text-muted mb-4">
                Review applications and update candidate status.
            </p>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {loading ? (
                <p>Loading applicants...</p>
            ) : applications.length === 0 ? (
                <div className="card shadow-sm">
                    <div className="card-body text-center py-5">
                        <h4>No Applicants Yet</h4>
                        <p className="text-muted mb-0">
                            Candidate applications will appear here.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="card shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th>Candidate</th>
                                    <th>Job</th>
                                    <th>Company</th>
                                    <th>Applied On</th>
                                    <th>Status</th>
                                    <th>Update Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {applications.map((application) => (
                                    <tr key={application.id}>
                                        <td>
                                            <div className="fw-semibold">
                                                {application.applicantName}
                                            </div>
                                            <small className="text-muted">
                                                {application.email}
                                            </small>
                                        </td>

                                        <td>{application.jobTitle}</td>
                                        <td>{application.company}</td>
                                        <td>{application.appliedDate}</td>

                                        <td>
                                            <span
                                                className={`badge ${statusClass(application.status)}`}
                                            >
                                                {application.status}
                                            </span>
                                        </td>

                                        <td>
                                            <select
                                                className="form-select form-select-sm"
                                                value={application.status}
                                                onChange={(e) =>
                                                    changeStatus(
                                                        application.id,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="Pending">
                                                    Pending
                                                </option>
                                                <option value="Shortlisted">
                                                    Shortlisted
                                                </option>
                                                <option value="Selected">
                                                    Selected
                                                </option>
                                                <option value="Rejected">
                                                    Rejected
                                                </option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Applicants;