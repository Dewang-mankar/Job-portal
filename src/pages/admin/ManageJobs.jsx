import { useEffect, useState } from "react";
import {
    getJobs,
    addJob as createJob,
    updateJob,
    deleteJob as removeJob
} from "../../services/api";

const emptyForm = {
    title: "",
    company: "",
    location: "",
    type: "Full Time",
    salary: "",
    description: "",
    skills: ""
};

function ManageJobs() {
    const [jobs, setJobs] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchJobs = async () => {
        try {
            const response = await getJobs();
            setJobs(response.data);
            setError("");
        } catch {
            setError("Unable to load jobs. Check that JSON Server is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const jobData = {
            ...form,
            skills: form.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
        };

        try {
            if (editingId !== null) {
                await updateJob(editingId, jobData);
            } else {
                await createJob(jobData);
            }

            await fetchJobs();
            resetForm();
        } catch {
            setError("Unable to save the job. Please try again.");
        }
    };

    const handleEdit = (job) => {
        setForm({
            title: job.title || "",
            company: job.company || "",
            location: job.location || "",
            type: job.type || "Full Time",
            salary: job.salary || "",
            description: job.description || "",
            skills: Array.isArray(job.skills)
                ? job.skills.join(", ")
                : job.skills || ""
        });

        setEditingId(job.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job?")) {
            return;
        }

        try {
            await removeJob(id);
            await fetchJobs();
        } catch {
            setError("Unable to delete the job. Please try again.");
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h1 className="fw-bold">Manage Jobs</h1>
                    <p className="text-muted">
                        Create, update and manage job postings.
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => {
                        if (showForm) {
                            resetForm();
                        } else {
                            setForm(emptyForm);
                            setEditingId(null);
                            setShowForm(true);
                        }
                    }}
                >
                    {showForm ? "Cancel" : "+ Add Job"}
                </button>
            </div>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {showForm && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body p-4">
                        <h4 className="fw-bold mb-4">
                            {editingId !== null ? "Edit Job" : "Add New Job"}
                        </h4>

                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Job Title</label>
                                    <input
                                        name="title"
                                        className="form-control"
                                        value={form.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Company</label>
                                    <input
                                        name="company"
                                        className="form-control"
                                        value={form.company}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Location</label>
                                    <input
                                        name="location"
                                        className="form-control"
                                        value={form.location}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Job Type</label>
                                    <select
                                        name="type"
                                        className="form-select"
                                        value={form.type}
                                        onChange={handleChange}
                                    >
                                        <option>Full Time</option>
                                        <option>Internship</option>
                                        <option>Part Time</option>
                                    </select>
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Salary</label>
                                    <input
                                        name="salary"
                                        className="form-control"
                                        placeholder="₹6 - 8 LPA"
                                        value={form.salary}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-12 mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows="3"
                                        value={form.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-12 mb-3">
                                    <label className="form-label">
                                        Skills (comma-separated)
                                    </label>
                                    <input
                                        name="skills"
                                        className="form-control"
                                        placeholder="React, JavaScript, CSS"
                                        value={form.skills}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button className="btn btn-success" type="submit">
                                {editingId !== null ? "Save Changes" : "Add Job"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-secondary ms-2"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <p>Loading jobs...</p>
            ) : (
                <div className="row g-4">
                    {jobs.map((job) => (
                        <div className="col-md-6 col-lg-4" key={job.id}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <h5 className="fw-bold">{job.title}</h5>
                                    <p className="text-muted mb-2">{job.company}</p>
                                    <p>📍 {job.location}</p>
                                    <p>💼 {job.type}</p>
                                    <p>💰 {job.salary}</p>

                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => handleEdit(job)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(job.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {jobs.length === 0 && (
                        <div className="col-12 text-center">
                            <h5>No jobs available</h5>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ManageJobs;