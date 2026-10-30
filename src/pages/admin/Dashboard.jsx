import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Title
} from "chart.js";
import { getJobs, getApplications } from "../../services/api";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Title
);

function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [jobsResponse, applicationsResponse] = await Promise.all([
                    getJobs(),
                    getApplications()
                ]);

                setJobs(jobsResponse.data);
                setApplications(applicationsResponse.data);
            } catch {
                setError("Unable to load dashboard data. Check JSON Server.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const pending = applications.filter(
        (application) => application.status === "Pending"
    ).length;

    const shortlisted = applications.filter(
        (application) => application.status === "Shortlisted"
    ).length;

    const selected = applications.filter(
        (application) => application.status === "Selected"
    ).length;

    const rejected = applications.filter(
        (application) => application.status === "Rejected"
    ).length;

    const statusChart = {
        labels: ["Pending", "Shortlisted", "Selected", "Rejected"],
        datasets: [
            {
                label: "Applications",
                data: [pending, shortlisted, selected, rejected],
                backgroundColor: [
                    "#ffc107",
                    "#0d6efd",
                    "#198754",
                    "#dc3545"
                ],
                borderWidth: 0
            }
        ]
    };

    const jobTypeCounts = jobs.reduce((counts, job) => {
        counts[job.type] = (counts[job.type] || 0) + 1;
        return counts;
    }, {});

    const jobChart = {
        labels: Object.keys(jobTypeCounts),
        datasets: [
            {
                label: "Jobs",
                data: Object.values(jobTypeCounts),
                backgroundColor: "#0d6efd",
                borderRadius: 6
            }
        ]
    };

    if (loading) {
        return <div className="container mt-5">Loading dashboard...</div>;
    }

    return (
        <div className="container mt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <div>
                    <h1 className="fw-bold">Recruiter Dashboard</h1>
                    <p className="text-muted mb-0">
                        Monitor jobs and candidate applications.
                    </p>
                </div>

                <Link to="/admin/jobs" className="btn btn-primary">
                    + Manage Jobs
                </Link>
            </div>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            <div className="row g-4">
                <div className="col-md-6 col-xl-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <p className="text-muted mb-2">Total Jobs</p>
                            <h2 className="fw-bold">{jobs.length}</h2>
                            <Link to="/admin/jobs">Manage jobs →</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-xl-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <p className="text-muted mb-2">Applications</p>
                            <h2 className="fw-bold">{applications.length}</h2>
                            <Link to="/admin/applicants">View applicants →</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-xl-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <p className="text-muted mb-2">Shortlisted</p>
                            <h2 className="fw-bold text-primary">{shortlisted}</h2>
                            <span className="text-muted">Candidates shortlisted</span>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-xl-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <p className="text-muted mb-2">Selected</p>
                            <h2 className="fw-bold text-success">{selected}</h2>
                            <span className="text-muted">Successful candidates</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mt-2">
                <div className="col-lg-7">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4">Jobs by Type</h5>

                            {jobs.length === 0 ? (
                                <p className="text-muted">No job data available.</p>
                            ) : (
                                <Bar
                                    data={jobChart}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: true,
                                        plugins: {
                                            legend: { display: false }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: { precision: 0 }
                                            }
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4">
                                Application Status
                            </h5>

                            {applications.length === 0 ? (
                                <p className="text-muted">
                                    No applications received yet.
                                </p>
                            ) : (
                                <Doughnut
                                    data={statusChart}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: true
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm border-0 mt-4">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">Recent Applications</h5>

                    {applications.length === 0 ? (
                        <p className="text-muted mb-0">
                            Applications will appear here when candidates apply.
                        </p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Candidate</th>
                                        <th>Job</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.slice(-5).reverse().map((application) => (
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
                                            <td>{application.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <Link
                        to="/admin/applicants"
                        className="btn btn-outline-primary mt-3"
                    >
                        View All Applicants
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;