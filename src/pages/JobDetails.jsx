
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getJobById, getApplications, addApplication } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./JobDetails.css";

function JobDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [jobResponse, applicationResponse] = await Promise.all([
                    getJobById(id),
                    getApplications()
                ]);

                setJob(jobResponse.data);
                setApplications(applicationResponse.data);
            } catch {
                setError("Unable to load job details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="job-details-loading">
                <div className="job-details-spinner"></div>
                Loading job details...
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    {error || "Job not found."}
                </div>
                <Link to="/jobs" className="btn btn-primary">
                    Back to Jobs
                </Link>
            </div>
        );
    }

    const jobApplications = applications.filter(
        (application) => String(application.jobId) === String(job.id)
    );

    const companyInitial = (job.company || "H").charAt(0).toUpperCase();

    const descriptionSections = [
        {
            title: "About the Role",
            content: job.description || "The employer has not provided a job description yet."
        },
        {
            title: "Key Responsibilities",
            content: job.responsibilities
        },
        {
            title: "Required Skills",
            content: job.skills
        },
        {
            title: "Experience & Qualifications",
            content: job.qualifications
        },
        {
            title: "Benefits",
            content: job.benefits
        }
    ].filter((section) => section.content);
     
   const handleApply = () => {
    if (!user) {
        navigate("/login", {
            state: { from: `/jobs/${job.id}/apply` }
        });
        return;
    }

    if (user.role === "recruiter") {
        setMessage("Recruiter accounts cannot apply for jobs.");
        return;
    }

    navigate(`/jobs/${job.id}/apply`);
};

    return (
        <main className="job-details-page">
            <div className="job-details-container">
                <div className="job-breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/jobs">Jobs</Link>
                    <span>/</span>
                    <span className="breadcrumb-current">{job.title}</span>
                </div>

                <section className="job-summary-card">
                    <div className="job-summary-main">
                        <div className="job-company-logo">
                            {job.logo ? (
                                <img src={job.logo} alt={`${job.company} logo`} />
                            ) : (
                                <span>{companyInitial}</span>
                            )}
                        </div>

                        <div className="job-summary-info">
                            <div className="job-title-row">
                                <h1>{job.title}</h1>
                                <span className="details-job-type">
                                    {job.type || "Full Time"}
                                </span>
                            </div>

                            <p className="details-company-name">
                                {job.company}
                            </p>

                            <div className="job-summary-tags">
                                <span>⌖ {job.location || "Location not specified"}</span>
                                <span>₹ {job.salary || "Salary not disclosed"}</span>
                                {job.experience && (
                                    <span>◷ {job.experience}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="job-summary-footer">
                        <div className="job-posted-info">
                            <span>
                                <strong>Job ID:</strong> {job.id}
                            </span>
                            <span>
                                <strong>Applicants:</strong> {jobApplications.length}
                            </span>
                        </div>

                        <button
                            className="job-apply-button"
                            onClick={handleApply}
                            disabled={applying}
                        >
                            {applying ? "Applying..." : "Apply Now →"}
                        </button>
                    </div>

                    {message && (
                        <div
                            className={`job-apply-message ${
                                message.includes("successfully")
                                    ? "success"
                                    : "error"
                            }`}
                            role="status"
                        >
                            {message}
                            {message.includes("successfully") && (
                                <Link to="/applications"> View my applications</Link>
                            )}
                        </div>
                    )}
                </section>

                <div className="job-details-layout">
                    <section className="job-description-card">
                        <div className="details-section-heading">
                            <span className="details-heading-icon">▤</span>
                            <h2>Job Description</h2>
                        </div>

                        {descriptionSections.map((section) => (
                            <div className="description-section" key={section.title}>
                                <h3>{section.title}</h3>

                                {Array.isArray(section.content) ? (
                                    <ul>
                                        {section.content.map((item, index) => (
                                            <li key={`${section.title}-${index}`}>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>{section.content}</p>
                                )}
                            </div>
                        ))}

                        <div className="description-section">
                            <h3>Job Overview</h3>
                            <ul>
                                <li>
                                    <strong>Position:</strong> {job.title}
                                </li>
                                <li>
                                    <strong>Employment Type:</strong>{" "}
                                    {job.type || "Not specified"}
                                </li>
                                <li>
                                    <strong>Location:</strong>{" "}
                                    {job.location || "Not specified"}
                                </li>
                                <li>
                                    <strong>Salary:</strong>{" "}
                                    {job.salary || "Not disclosed"}
                                </li>
                            </ul>
                        </div>

                        <button
                            className="job-apply-button description-apply"
                            onClick={handleApply}
                            disabled={applying}
                        >
                            {applying ? "Applying..." : "Apply for this Position →"}
                        </button>
                    </section>

                    <aside className="job-company-sidebar">
                        <section className="company-info-card">
                            <div className="details-section-heading">
                                <span className="details-heading-icon">▣</span>
                                <h2>About Company</h2>
                            </div>

                            <div className="company-detail-item">
                                <span className="company-detail-icon">▤</span>
                                <div>
                                    <label>Company Name</label>
                                    <p>{job.company}</p>
                                </div>
                            </div>

                            {job.website && (
                                <div className="company-detail-item">
                                    <span className="company-detail-icon">◎</span>
                                    <div>
                                        <label>Website</label>
                                        <a
                                            href={job.website}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {job.website.replace(/^https?:\/\//, "")}
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="company-detail-item">
                                <span className="company-detail-icon">⌖</span>
                                <div>
                                    <label>Location</label>
                                    <p>{job.location || "Not specified"}</p>
                                </div>
                            </div>

                            <div className="company-detail-item">
                                <span className="company-detail-icon">◇</span>
                                <div>
                                    <label>Skills</label>
                                    <div className="details-skills">
                                        {(job.skills || []).length > 0 ? (
                                            job.skills.map((skill) => (
                                                <span key={skill}>{skill}</span>
                                            ))
                                        ) : (
                                            <p>Not specified</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {job.companyDescription && (
                                <div className="company-about-text">
                                    <label>About the Employer</label>
                                    <p>{job.companyDescription}</p>
                                </div>
                            )}
                        </section>

                        {/* <section className="job-help-card">
                            <h3>Interested in this role?</h3>
                            <p>Review the requirements and submit your application.</p>
                            <button
                                className="job-apply-button sidebar-apply"
                                onClick={handleApply}
                                disabled={applying}
                            >
                                Apply Now →
                            </button>
                        </section> */}
                    </aside>
                </div>

                <Link to="/jobs" className="job-back-link">
                    ← Back to all jobs
                </Link>
            </div>
        </main>
    );
}

export default JobDetails;
