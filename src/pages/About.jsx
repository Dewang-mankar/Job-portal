
import { Link } from "react-router-dom";
import "./About.css";

function About() {
    const features = [
        {
            icon: "🔎",
            title: "Wide Opportunities",
            text: "Explore opportunities from top companies across multiple domains.",
            color: "blue"
        },
        {
            icon: "⚡",
            title: "Easy Application",
            text: "Apply to jobs quickly with a simple and smooth process.",
            color: "green"
        },
        {
            icon: "🛡️",
            title: "Trusted Platform",
            text: "Discover job opportunities and manage your applications in one place.",
            color: "orange"
        },
        {
            icon: "📈",
            title: "Career Growth",
            text: "Find opportunities that help you learn, grow, and achieve your goals.",
            color: "pink"
        }
    ];

    const steps = [
        {
            number: "01",
            icon: "👤",
            title: "Create Your Profile",
            text: "Register and build your professional profile."
        },
        {
            number: "02",
            icon: "🔍",
            title: "Discover Jobs",
            text: "Explore jobs that match your skills and interests."
        },
        {
            number: "03",
            icon: "📨",
            title: "Apply with Ease",
            text: "Submit applications and track your progress."
        },
        {
            number: "04",
            icon: "🎉",
            title: "Get Hired",
            text: "Take the next step toward your dream career."
        }
    ];

    return (
        <main className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <span className="about-label">
                        ✦ ABOUT HIREFLOW
                    </span>

                    <h1>
                        Building Careers.
                        <br />
                        Creating <span>Better Futures.</span>
                    </h1>

                    <p>
                        At HireFlow, we believe everyone deserves the right
                        opportunity to grow. We connect talented individuals
                        with career opportunities and make job searching
                        simpler, faster, and smarter.
                    </p>

                    <div className="about-hero-buttons">
                        <Link to="/jobs" className="about-btn-primary">
                            💼 Explore Jobs <span>→</span>
                        </Link>

                        <a href="#our-story" className="about-btn-secondary">
                            Our Story
                        </a>
                    </div>

                    <div className="about-trust">
                        <div className="about-avatar-stack">
                            <span>👨🏻‍💻</span>
                            <span>👩🏻‍💼</span>
                            <span>👨🏽‍💼</span>
                            <span>👩🏼‍💻</span>
                        </div>
                        <span>Connecting talent with opportunity</span>
                    </div>
                </div>

                <div className="about-hero-visual">
                    <div className="hero-orbit orbit-one"></div>
                    <div className="hero-orbit orbit-two"></div>

                    <div className="floating-card floating-job">
                        <span className="floating-icon">💼</span>
                        <div>
                            <strong>Dream Job</strong>
                            <small>Awaits You</small>
                        </div>
                        <span className="floating-check">✓</span>
                    </div>

                    <div className="hero-person">
                        <div className="hero-person-head">👨🏻‍💻</div>
                        <div className="hero-person-body"></div>
                        <div className="hero-laptop">H</div>
                    </div>

                    <div className="floating-card floating-success">
                        <span>✅ Learn</span>
                        <span>✅ Apply</span>
                        <span>✅ Get Hired</span>
                    </div>

                    <div className="floating-card floating-growth">
                        <span>📊</span>
                        <strong>Your career is growing!</strong>
                    </div>

                    <div className="hero-spark spark-one">✦</div>
                    <div className="hero-spark spark-two">✧</div>
                </div>
            </section>

            {/* Statistics */}
            <section className="about-stats">
                <div className="about-stat">
                    <span>👥</span>
                    <h2>Career First</h2>
                    <p>People Matter</p>
                </div>

                <div className="about-stat">
                    <span>🏢</span>
                    <h2>One Platform</h2>
                    <p>For Jobs & Hiring</p>
                </div>

                <div className="about-stat">
                    <span>🎯</span>
                    <h2>Focused Search</h2>
                    <p>Find Your Direction</p>
                </div>

                <div className="about-stat">
                    <span>🚀</span>
                    <h2>Future Ready</h2>
                    <p>Grow Your Career</p>
                </div>
            </section>

            {/* Mission and Vision */}
            <section className="about-story" id="our-story">
                <article className="story-card mission-card">
                    <div className="story-illustration">🎯</div>
                    <div>
                        <span className="about-label">OUR MISSION</span>
                        <h2>Empower People Through Opportunities</h2>
                        <p>
                            To make job searching accessible and convenient
                            by bringing candidates, job opportunities, and
                            application management together in one platform.
                        </p>
                    </div>
                </article>

                <article className="story-card vision-card">
                    <div className="story-illustration">🌎</div>
                    <div>
                        <span className="about-label">OUR VISION</span>
                        <h2>A World Where Everyone Can Grow</h2>
                        <p>
                            We envision a future where people can discover
                            meaningful career opportunities and organizations
                            can connect with the talent they need.
                        </p>
                    </div>
                </article>
            </section>

            {/* Features */}
            <section className="about-features-section">
                <div className="about-section-heading">
                    <span className="about-label">WHY CHOOSE HIREFLOW</span>
                    <h2>More Than Just a Job Portal</h2>
                    <p>
                        Everything you need to take the next step in your career.
                    </p>
                </div>

                <div className="about-features-grid">
                    {features.map((feature) => (
                        <article
                            className={`about-feature-card ${feature.color}`}
                            key={feature.title}
                        >
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.text}</p>
                            <span className="feature-arrow">↗</span>
                        </article>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="about-process">
                <div className="about-section-heading">
                    <span className="about-label">HOW IT WORKS</span>
                    <h2>Your Path to a Better Career</h2>
                    <p>Four simple steps to move your career forward.</p>
                </div>

                <div className="about-steps">
                    {steps.map((step) => (
                        <article className="about-step" key={step.number}>
                            <div className="step-visual">
                                <span className="step-number">{step.number}</span>
                                <span className="step-emoji">{step.icon}</span>
                            </div>
                            <h3>{step.title}</h3>
                            <p>{step.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className="about-cta">
                <div className="cta-content">
                    <span className="cta-eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
                    <h2>Find Your Dream Job Today.</h2>
                    <p>
                        Explore new possibilities and take the first step
                        toward your professional goals with HireFlow.
                    </p>

                    <div className="about-hero-buttons">
                        <Link to="/jobs" className="cta-light-btn">
                            🔎 Browse Jobs
                        </Link>
                        <Link to="/register" className="cta-outline-btn">
                            Create Account →
                        </Link>
                    </div>
                </div>

                <div className="cta-illustration">
                    <div className="cta-circle"></div>
                    <div className="cta-person">👩🏻‍💻</div>
                    <div className="cta-laptop">H</div>
                    <span className="cta-star star-a">✦</span>
                    <span className="cta-star star-b">✧</span>
                    <span className="cta-star star-c">✦</span>
                </div>
            </section>

            <footer className="about-footer">
                <Link to="/" className="about-footer-brand">
                    <span>H</span> HireFlow
                </Link>
                <p>Connecting talent with opportunity.</p>
                <Link to="/jobs">Explore opportunities →</Link>
            </footer>
        </main>
    );
}

export default About;
