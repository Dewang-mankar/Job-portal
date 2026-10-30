
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getJobs } from "../services/api";
import "./Home.css";

function Home() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await getJobs();
                setJobs(response.data);
            } catch (error) {
                console.error("Unable to load jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/jobs?search=${encodeURIComponent(search.trim())}`);
    };

    const features = [
        {
            icon: "🔎",
            title: "Smart Job Discovery",
            text: "Explore opportunities based on your interests, skills, and career goals."
        },
        {
            icon: "⚡",
            title: "Quick Applications",
            text: "Discover roles and submit applications through a simple workflow."
        },
        {
            icon: "📊",
            title: "Track Your Progress",
            text: "Keep an eye on your applications and follow your recruitment journey."
        },
        {
            icon: "🤝",
            title: "Connect with Employers",
            text: "Bring candidates and recruiters together in one convenient platform."
        }
    ];

    const steps = [
        { icon: "👤", title: "Create an Account", text: "Set up your candidate profile." },
        { icon: "🔍", title: "Find Your Match", text: "Search roles that fit your interests." },
        { icon: "📨", title: "Apply for Jobs", text: "Submit your application with ease." },
        { icon: "🚀", title: "Move Forward", text: "Track your applications and next steps." }
    ];

    return (
        <main className="home-page">
            {/* Hero */}
            <section className="home-hero">
                <div className="home-hero-content">
                    <span className="home-eyebrow">
                        ✦ YOUR CAREER JOURNEY STARTS HERE
                    </span>

                    <h1>
                        Your Talent.
                        <br />
                        Your Future.
                        <br />
                        <span>Your Next Opportunity.</span>
                    </h1>

                    <p className="home-hero-description">
                        Discover exciting career opportunities, connect with
                        employers, and take the next step toward a future
                        you're proud of.
                    </p>

                    <form className="home-search" onSubmit={handleSearch}>
                        <span className="home-search-icon">⌕</span>

                        <input
                            type="search"
                            placeholder="Job title, company or skill..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            aria-label="Search jobs"
                        />

                        <button type="submit">
                            Search Jobs <span>→</span>
                        </button>
                    </form>

                    <div className="home-hero-actions">
                        <Link to="/jobs" className="home-primary-btn">
                            Explore All Jobs ↗
                        </Link>

                        <Link to="/about" className="home-secondary-btn">
                            Discover HireFlow
                        </Link>
                    </div>

                    <div className="home-hero-note">
                        <span>💙</span>
                        Your next chapter begins with one small step.
                    </div>
                </div>

                {/* Decorative illustration made with emoji and CSS */}
                <div className="home-hero-art">
                    <div className="home-art-circle"></div>
                    <div className="home-art-ring ring-one"></div>
                    <div className="home-art-ring ring-two"></div>

                    <div className="home-art-person">
                        <div className="home-art-head">👩🏻‍💻</div>
                        <div className="home-art-body"></div>
                        <div className="home-art-laptop">H</div>
                    </div>

                    <div className="home-float-card home-float-job">
                        <span className="home-float-icon">💼</span>
                        <div>
                            <strong>Dream Job</strong>
                            <small>One step closer!</small>
                        </div>
                        <span className="home-float-check">✓</span>
                    </div>

                    <div className="home-float-card home-float-skills">
                        <span>✨</span>
                        <div>
                            <strong>Your Skills Matter</strong>
                            <small>Show the world what you can do.</small>
                        </div>
                    </div>

                    <div className="home-float-card home-float-growth">
                        <span>📈</span>
                        <strong>Keep Growing!</strong>
                    </div>

                    <span className="home-art-star art-star-one">✦</span>
                    <span className="home-art-star art-star-two">✧</span>
                    <span className="home-art-star art-star-three">✦</span>
                </div>
            </section>

            {/* Quick benefits */}
            <section className="home-highlights">
                <div>
                    <span>💼</span>
                    <div>
                        <strong>Explore Opportunities</strong>
                        <p>Find roles across different domains.</p>
                    </div>
                </div>

                <div>
                    <span>🎯</span>
                    <div>
                        <strong>Focus on Your Goals</strong>
                        <p>Discover jobs that match your skills.</p>
                    </div>
                </div>

                <div>
                    <span>🚀</span>
                    <div>
                        <strong>Build Your Future</strong>
                        <p>Take the next step in your career.</p>
                    </div>
                </div>
            </section>

            {/* Featured jobs */}
            <section className="home-featured">
                <div className="home-section-heading">
                    <div>
                        <span className="home-eyebrow">HANDPICKED FOR YOU</span>
                        <h2>Explore Featured Jobs</h2>
                        <p>Discover opportunities to put your skills into action.</p>
                    </div>

                    <Link to="/jobs" className="home-view-all">
                        View All Jobs →
                    </Link>
                </div>

                {loading ? (
                    <div className="home-loading">
                        <div className="home-spinner"></div>
                        Loading opportunities...
                    </div>
                ) : jobs.length > 0 ? (
                    <div className="home-jobs-grid">
                        {jobs.slice(0, 3).map((job) => (
                            <article className="home-job-card" key={job.id}>
                                <div className="home-job-top">
                                    <div className="home-company-logo">
                                        {job.logo ? (
                                            <img src={job.logo} alt={`${job.company} logo`} />
                                        ) : (
                                            (job.company || "H").charAt(0).toUpperCase()
                                        )}
                                    </div>

                                    <span className="home-job-badge">
                                        {job.type || "Full Time"}
                                    </span>
                                </div>

                                <h3>{job.title}</h3>
                                <p className="home-job-company">{job.company}</p>

                                <div className="home-job-meta">
                                    <span>📍 {job.location || "Location not specified"}</span>
                                    <span>💰 {job.salary || "Salary not disclosed"}</span>
                                </div>

                                <div className="home-job-skills">
                                    {(job.skills || []).slice(0, 3).map((skill) => (
                                        <span key={skill}>{skill}</span>
                                    ))}
                                </div>

                                <Link
                                    to={`/jobs/${job.id}`}
                                    className="home-job-link"
                                >
                                    View Details <span>↗</span>
                                </Link>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="home-no-jobs">
                        <span>🔎</span>
                        <h3>New opportunities are on the way!</h3>
                        <p>Visit the jobs page to explore available listings.</p>
                        <Link to="/jobs" className="home-primary-btn">
                            Browse Jobs
                        </Link>
                    </div>
                )}
            </section>

            {/* Features */}
            <section className="home-why">
                <div className="home-section-heading centered">
                    <span className="home-eyebrow">WHY HIREFLOW?</span>
                    <h2>A Better Way to Build Your Career</h2>
                    <p>
                        Designed to make discovering opportunities easier
                        and your career journey more organized.
                    </p>
                </div>

                <div className="home-features-grid">
                    {features.map((feature, index) => (
                        <article
                            className={`home-feature-card feature-color-${index + 1}`}
                            key={feature.title}
                        >
                            <div className="home-feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.text}</p>
                            <span className="home-feature-arrow">↗</span>
                        </article>
                    ))}
                </div>
            </section>

            {/* Steps */}
            <section className="home-how">
                <div className="home-section-heading centered">
                    <span className="home-eyebrow">GET STARTED</span>
                    <h2>Your Career Journey in Four Steps</h2>
                    <p>From discovering opportunities to taking your next big step.</p>
                </div>

                <div className="home-steps-grid">
                    {steps.map((step, index) => (
                        <article className="home-step" key={step.title}>
                            <div className="home-step-icon">
                                <span>{step.icon}</span>
                                <small>0{index + 1}</small>
                            </div>
                            <h3>{step.title}</h3>
                            <p>{step.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="home-cta">
                <div className="home-cta-content">
                    <span>✦ YOUR FUTURE IS WAITING</span>
                    <h2>Ready to Find Your Next Opportunity?</h2>
                    <p>
                        Start exploring jobs, discover your potential, and
                        move one step closer to your career goals.
                    </p>

                    <div className="home-cta-actions">
                        <Link to="/jobs" className="home-cta-white-btn">
                            Find Jobs Now →
                        </Link>

                        <Link to="/register" className="home-cta-outline-btn">
                            Join HireFlow
                        </Link>
                    </div>
                </div>

                <div className="home-cta-art">
                    <div className="home-cta-circle"></div>
                    <span className="home-cta-person">🧑🏻‍💻</span>
                    <span className="home-cta-briefcase">💼</span>
                    <span className="home-cta-spark">✦</span>
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <Link to="/" className="home-footer-brand">
                    <span>H</span> HireFlow
                </Link>

                <p>Connecting talent with opportunity.</p>

                <div>
                    <Link to="/jobs">Jobs</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/register">Join Us</Link>
                </div>
            </footer>
        </main>
    );
}

export default Home;
