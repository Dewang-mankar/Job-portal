
import { useEffect, useMemo, useState } from "react";
import { getJobs } from "../services/api";
import "../pages/jobs.css";
import { useSearchParams } from "react-router-dom";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [searchParams] = useSearchParams();

const [search, setSearch] = useState(
    searchParams.get("search") || ""
);
    
    const [skill, setSkill] = useState("All");
    const [experience, setExperience] = useState("All");
    const [jobType, setJobType] = useState("All");
    const [location, setLocation] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await getJobs();
                setJobs(response.data);
            } catch {
                setError("Unable to load jobs. Please start JSON Server.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            const searchText = search.toLowerCase().trim();

            const matchesSearch =
                `${job.title} ${job.company} ${(job.skills || []).join(" ")}`
                    .toLowerCase()
                    .includes(searchText);

            const matchesSkill =
                skill === "All" ||
                (job.skills || []).some(
                    (item) => item.toLowerCase() === skill.toLowerCase()
                );

            const matchesExperience =
                experience === "All" ||
                (job.experience || "Fresher") === experience;

            const matchesType =
                jobType === "All" || job.type === jobType;

            const matchesLocation =
                location === "All" ||
                (job.location || "").toLowerCase() === location.toLowerCase();

            return (
                matchesSearch &&
                matchesSkill &&
                matchesExperience &&
                matchesType &&
                matchesLocation
            );
        });
    }, [jobs, search, skill, experience, jobType, location]);

    const uniqueSkills = [
        ...new Set(jobs.flatMap((job) => job.skills || []))
    ];

    const uniqueLocations = [
        ...new Set(jobs.map((job) => job.location).filter(Boolean))
    ];

    if (loading) {
        return (
            <div className="jobs-loading">
                <div className="jobs-spinner"></div>
                <p>Finding opportunities for you...</p>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger m-4">{error}</div>;
    }

    return (
        <main className="jobs-page">
            <section className="jobs-heading">
                <span className="jobs-eyebrow">YOUR NEXT OPPORTUNITY</span>
                <h1>Find a job you'll <span>love.</span></h1>
                <p>Explore opportunities and take the next step in your career.</p>
            </section>

            <section className="jobs-filters">
                <div className="jobs-search">
                    <span className="filter-icon">⌕</span>
                    <input
                        type="search"
                        placeholder="Search role, company or skill..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select value={skill} onChange={(e) => setSkill(e.target.value)}>
                    <option value="All">All Skills</option>
                    {uniqueSkills.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>

                <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                >
                    <option value="All">Experience</option>
                    <option value="Fresher">Fresher</option>
                    <option value="0-1 years">0–1 years</option>
                    <option value="1-3 years">1–3 years</option>
                    <option value="3+ years">3+ years</option>
                </select>

                <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                >
                    <option value="All">All Job Types</option>
                    {[...new Set(jobs.map((job) => job.type).filter(Boolean))].map(
                        (type) => <option key={type} value={type}>{type}</option>
                    )}
                </select>

                <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                >
                    <option value="All">All Locations</option>
                    {uniqueLocations.map((place) => (
                        <option key={place} value={place}>{place}</option>
                    ))}
                </select>
            </section>

            <div className="jobs-results">
                <p>
                    <strong>{filteredJobs.length}</strong>{" "}
                    opportunities found
                </p>

                <button
                    className="jobs-reset"
                    onClick={() => {
                        setSearch("");
                        setSkill("All");
                        setExperience("All");
                        setJobType("All");
                        setLocation("All");
                    }}
                >
                    Reset filters ↻
                </button>
            </div>

            {filteredJobs.length > 0 ? (
                <section className="jobs-grid">
                    {filteredJobs.map((job, index) => (
                        <article
                            className="modern-job-card"
                            key={job.id}
                            style={{ "--card-index": index }}
                        >
                            <div className="job-card-top">
                                <div className="company-logo">
                                    {job.logo ? (
                                        <img src={job.logo} alt={`${job.company} logo`} />
                                    ) : (
                                        <span>
                                            {(job.company || "J").charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                <div className="job-company-info">
                                    <h3 title={job.company}>{job.company}</h3>
                                    <p>{job.title}</p>
                                </div>

                                <span className="job-type-badge">
                                    {job.type || "Full Time"}
                                </span>
                            </div>

                            <div className="job-meta">
                                <span>⌖ {job.location || "Location not specified"}</span>
                                <span> {job.salary || "Salary not disclosed"}</span>
                            </div>

                            <div className="job-skills">
                                {(job.skills || []).slice(0, 3).map((item) => (
                                    <span key={item}>{item}</span>
                                ))}

                                {(job.skills || []).length > 3 && (
                                    <span>
                                        +{job.skills.length - 3}
                                    </span>
                                )}

                                {(!job.skills || job.skills.length === 0) && (
                                    <span>Skills not specified</span>
                                )}
                            </div>

                            <div className="job-card-footer">
                                <span className="applicant-count">
                                    ♙ {job.applicantsCount ?? 0} applicants
                                </span>

                                <button
                                    className="view-job-btn"
                                    onClick={() => {
                                        window.location.href = `/jobs/${job.id}`;
                                    }}
                                >
                                    View Details <span>↗</span>
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            ) : (
                <div className="jobs-empty">
                    <div>⌕</div>
                    <h3>No jobs found</h3>
                    <p>Try another keyword or reset your filters.</p>
                    <button
                        className="view-job-btn"
                        onClick={() => {
                            setSearch("");
                            setSkill("All");
                            setExperience("All");
                            setJobType("All");
                            setLocation("All");
                        }}
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </main>
    );
}

export default Jobs;
