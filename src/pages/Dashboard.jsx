
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApplications } from "../services/api";
import "./Dashboard.css";

function Dashboard() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await getApplications();

                const userApplications = response.data.filter(
                    (application) =>
                        application.email?.toLowerCase() ===
                        user?.email?.toLowerCase()
                );

                setApplications(userApplications);
            } catch (error) {
                console.error("Failed to load applications:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) {
            fetchApplications();
        } else {
            setLoading(false);
        }
    }, [user]);

    const pendingCount = applications.filter(
        (application) =>
            ["pending", "under review", "reviewing"].includes(
                application.status?.toLowerCase()
            )
    ).length;

    const selectedCount = applications.filter(
        (application) =>
            ["selected", "accepted", "hired"].includes(
                application.status?.toLowerCase()
            )
    ).length;

    const firstName = user?.name?.trim().split(/\s+/)[0] || "Candidate";

    const stats = [
        {
            title: "Applications",
            value: applications.length,
            description: "Jobs you've applied for",
            icon: "📄",
            className: "applications",
        },
        {
            title: "Under Review",
            value: pendingCount,
            description: "Applications being reviewed",
            icon: "⏳",
            className: "pending",
        },
        {
            title: "Selected",
            value: selectedCount,
            description: "Successful applications",
            icon: "🎉",
            className: "selected",
        },
    ];

    return (
        <main className="candidate-dashboard">
            <div className="dashboard-container">

                <section className="dashboard-hero">
                    <div className="dashboard-hero-content">
                        <span className="dashboard-eyebrow">
                            YOUR CAREER SPACE
                        </span>

                        <h1>
                            Welcome back, {firstName}!
                            <span className="welcome-wave"> 👋</span>
                        </h1>

                        <p>
                            Your next opportunity could be just one application
                            away. Keep moving toward your career goals.
                        </p>

                        <div className="dashboard-hero-actions">
                            <Link to="/jobs" className="dashboard-primary-btn">
                                Explore Jobs <span>→</span>
                            </Link>

                            <Link
                                to="/applications"
                                className="dashboard-secondary-btn"
                            >
                                My Applications
                            </Link>
                        </div>
                    </div>

                    <div className="dashboard-hero-art" aria-hidden="true">
                        <div className="hero-art-circle">
                            <span className="hero-art-person">👨‍💻</span>
                        </div>
                        <div className="hero-art-card hero-art-card-top">
                            <span>✨</span>
                            <div>
                                <strong>New opportunities</strong>
                                <small>Start exploring today</small>
                            </div>
                        </div>
                        <div className="hero-art-card hero-art-card-bottom">
                            <span>🚀</span>
                            <div>
                                <strong>Career growth</strong>
                                <small>Your journey starts here</small>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="dashboard-section">
                    <div className="dashboard-section-heading">
                        <div>
                            <span className="dashboard-section-label">
                                YOUR PROGRESS
                            </span>
                            <h2>Application Overview</h2>
                            <p>Track your job search at a glance.</p>
                        </div>

                        <Link
                            to="/applications"
                            className="dashboard-text-link"
                        >
                            View all <span>→</span>
                        </Link>
                    </div>

                    <div className="dashboard-stats-grid">
                        {stats.map((stat) => (
                            <article
                                className={`dashboard-stat-card ${stat.className}`}
                                key={stat.title}
                            >
                                <div className="dashboard-stat-top">
                                    <div className="dashboard-stat-icon">
                                        {stat.icon}
                                    </div>
                                    <span className="dashboard-stat-dot" />
                                </div>

                                <p className="dashboard-stat-title">
                                    {stat.title}
                                </p>

                                <h3>
                                    {loading ? "—" : stat.value}
                                </h3>

                                <p className="dashboard-stat-description">
                                    {stat.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="dashboard-lower-grid">
                    <article className="dashboard-profile-card">
                        <div className="dashboard-section-heading profile-heading">
                            <div>
                                <span className="dashboard-section-label">
                                    ACCOUNT DETAILS
                                </span>
                                <h2>My Profile</h2>
                            </div>

                            <div className="profile-avatar">
                                {firstName.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        <div className="dashboard-profile-details">
                            <div className="profile-detail-row">
                                <span className="profile-detail-icon">👤</span>
                                <div>
                                    <small>Full Name</small>
                                    <strong>{user?.name || "Not provided"}</strong>
                                </div>
                            </div>

                            <div className="profile-detail-row">
                                <span className="profile-detail-icon">✉️</span>
                                <div>
                                    <small>Email Address</small>
                                    <strong>{user?.email || "Not provided"}</strong>
                                </div>
                            </div>

                            <div className="profile-detail-row">
                                <span className="profile-detail-icon">💼</span>
                                <div>
                                    <small>Account Type</small>
                                    <strong className="candidate-role">
                                        {user?.role || "Candidate"}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </article>

                    <article className="dashboard-quick-card">
                        <span className="dashboard-section-label">
                            QUICK ACTIONS
                        </span>
                        <h2>What's next?</h2>
                        <p>
                            Take the next step toward finding your ideal job.
                        </p>

                        <Link to="/jobs" className="dashboard-action-item">
                            <span className="quick-action-icon">🔎</span>
                            <span>
                                <strong>Find a Job</strong>
                                <small>Discover new opportunities</small>
                            </span>
                            <span className="quick-action-arrow">→</span>
                        </Link>

                        <Link
                            to="/applications"
                            className="dashboard-action-item"
                        >
                            <span className="quick-action-icon">📋</span>
                            <span>
                                <strong>Track Applications</strong>
                                <small>Check your application status</small>
                            </span>
                            <span className="quick-action-arrow">→</span>
                        </Link>

                        <div className="dashboard-tip">
                            <span>💡</span>
                            <p>
                                <strong>Career tip</strong>
                                <br />
                                Keep your resume updated before applying.
                            </p>
                        </div>
                    </article>
                </section>

                <section className="dashboard-bottom-cta">
                    <div>
                        <span>YOUR NEXT CHAPTER STARTS HERE</span>
                        <h2>Ready for your next opportunity?</h2>
                        <p>Explore openings and find a role that fits your skills.</p>
                    </div>

                    <Link to="/jobs" className="dashboard-cta-button">
                        Browse Jobs <span>→</span>
                    </Link>
                </section>

            </div>
        </main>
    );
}

export default Dashboard;
