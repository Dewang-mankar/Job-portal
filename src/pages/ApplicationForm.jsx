
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getJobById, getApplications, addApplication } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./ApplicationForm.css";

function ApplicationForm() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [resume, setResume] = useState(null);
    const [resumeName, setResumeName] = useState("");

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        education: "",
        passoutYear: ""
    });
    
const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
        ...previousForm,
        [name]: value
    }));
};


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getJobById(id);
                setJob(response.data);

                // Prefer the authenticated user's details; fall back to stored registration.
                const users = JSON.parse(
                    localStorage.getItem("hireflow_users") || "[]"
                );

                const storedUser = users.find(
                    (item) =>
                        item.email?.toLowerCase() === user?.email?.toLowerCase()
                );

                const profile = { ...storedUser, ...user };

                const nameParts = (profile.name || "").trim().split(/\s+/);
                const firstName =
                    profile.firstName || nameParts[0] || "";
                const lastName =
                    profile.lastName || nameParts.slice(1).join(" ");

                setForm({
                    firstName,
                    lastName,
                    email: profile.email || "",
                    phone: profile.phone || "",
                    education: profile.education || "",
                    passoutYear: profile.passoutYear || ""
                });
            } catch {
                setError("Unable to load the job or your profile.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        } else {
            navigate("/login", { replace: true });
        }
    }, [id, user, navigate]);

const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    setError("");

    if (!file) {
        setResume(null);
        setResumeName("");
        return;
    }

    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
        setError("Upload your resume as a PDF, DOC, or DOCX file.");
        e.target.value = "";
        return;
    }

    // Keep the file small because JSON Server has a 100 KB request limit.
    const MAX_RESUME_SIZE = 50 * 1024;

    if (file.size > MAX_RESUME_SIZE) {
        setError("For this demo, your resume must be 50 KB or smaller.");
        e.target.value = "";
        setResume(null);
        setResumeName("");
        return;
    }

    setResume(file);
    setResumeName(file.name);
};


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.firstName.trim() || !form.lastName.trim()) {
            setError("First name and last name are required.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            setError("Enter a valid email address.");
            return;
        }

        if (!/^[6-9]\d{9}$/.test(form.phone)) {
            setError("Enter a valid 10-digit Indian mobile number.");
            return;
        }

        if (!form.education.trim()) {
            setError("Please enter your education or qualification.");
            return;
        }

        const year = Number(form.passoutYear);
        if (!Number.isInteger(year) || year < 1950 || year > 2100) {
            setError("Enter a valid passout year.");
            return;
        }

        if (!resume) {
            setError("Please upload your resume.");
            return;
        }

        setSubmitting(true);

        try {
            const applicationsResponse = await getApplications();

            const alreadyApplied = applicationsResponse.data.some(
                (application) =>
                    String(application.jobId) === String(job.id) &&
                    application.email?.toLowerCase() ===
                        form.email.trim().toLowerCase()
            );

            if (alreadyApplied) {
                setError("You have already applied for this job.");
                return;
            }

            // Convert the selected resume to a data URL for this demo.
            // The 2 MB limit helps keep the JSON Server database manageable.
            const resumeData = await new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () =>
        reject(new Error("Resume could not be read."));

    reader.readAsDataURL(resume);
});

            const fullName =
                `${form.firstName.trim()} ${form.lastName.trim()}`;

            await addApplication({
                jobId: String(job.id),
                jobTitle: job.title,
                company: job.company,
                name: fullName,
                applicantName: fullName,
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone,
                education: form.education.trim(),
                passoutYear: year,
                resumeName,
                resumeData,
                appliedAt: new Date().toISOString(),
                appliedDate: new Date().toLocaleDateString("en-US"),
                status: "Pending"
            });

            navigate("/applications", {
                state: { applicationSubmitted: true }
            });
        } catch {
            setError("Application submission failed. Check that JSON Server is running.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="application-loading">Loading application form...</div>;
    }

    if (!job) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    {error || "Job not found."}
                </div>
                <Link to="/jobs" className="btn btn-primary">Back to Jobs</Link>
            </div>
        );
    }

    return (
        <main className="application-page">
            <div className="application-container">
                <Link to={`/jobs/${job.id}`} className="application-back">
                    ← Back to job details
                </Link>

                <header className="application-header">
                    <span className="application-eyebrow">HIREFLOW APPLICATION</span>
                    <h1>Apply for this Job</h1>
                    <p>Complete your details and submit your application.</p>
                </header>

                <section className="application-job-summary">
                    <div className="application-company-icon">
                        {job.logo ? (
                            <img src={job.logo} alt={`${job.company} logo`} />
                        ) : (
                            (job.company || "H").charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <h2>{job.title}</h2>
                        <p>{job.company} · {job.location}</p>
                        <span>{job.type} · {job.salary}</span>
                    </div>
                </section>

                <form className="application-form-card" onSubmit={handleSubmit}>
                    <div className="application-form-heading">
                        <h2>Personal Information</h2>
                        <p>Your name and email are pre-filled from your account.</p>
                    </div>

                    {error && (
                        <div className="application-error" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="application-fields">
                        <div className="application-field">
                            <label htmlFor="firstName">First Name *</label>
                            <input
                                id="firstName"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="application-field">
                            <label htmlFor="lastName">Last Name *</label>
                            <input
                                id="lastName"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="application-field">
                            <label htmlFor="email">Email Address *</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="application-field">
                            <label htmlFor="phone">Mobile Number *</label>
                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                inputMode="numeric"
                                maxLength={10}
                                placeholder="10-digit mobile number"
                                required
                            />
                        </div>

                        <div className="application-field full-width">
                            <label htmlFor="education">Education / Qualification *</label>
                            <input
                                id="education"
                                name="education"
                                value={form.education}
                                onChange={handleChange}
                                placeholder="e.g. B.E. Computer Engineering"
                                required
                            />
                        </div>

                        <div className="application-field full-width">
                            <label htmlFor="passoutYear">Passout Year *</label>
                            <select
                                id="passoutYear"
                                name="passoutYear"
                                value={form.passoutYear}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select passout year</option>
                                {Array.from({ length: 21 }, (_, i) => 2026 - i).map(
                                    (year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="application-field full-width">
                            <label htmlFor="resume">Upload Resume * (PDF, DOC, DOCX)</label>

                            <label className="resume-upload-box" htmlFor="resume">
                                <span className="resume-upload-icon">📄</span>
                                <strong>
                                    {resumeName || "Choose your resume"}
                                </strong>
                                <span>
                                    {resumeName
                                        ? "Click to select a different file"
                                        : "Maximum file size: 2 MB"}
                                </span>
                                
                            </label>

                            <input
                                id="resume"
                                className="resume-file-input"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="application-submit-row">
                        <p>* Required fields</p>
                        <button type="submit" disabled={submitting}>
                            {submitting ? "Submitting..." : "Submit Application →"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default ApplicationForm;
