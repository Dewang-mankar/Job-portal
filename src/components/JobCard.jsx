import { Link } from "react-router-dom";

function JobCard({ job }) {
  return (
    <div className="card shadow-sm h-100">

      <div className="card-body">

        <h5 className="card-title fw-bold">
          {job.title}
        </h5>

        <p className="text-muted mb-2">
          🏢 {job.company}
        </p>

        <p className="mb-2">
          📍 {job.location}
        </p>

        <p className="mb-2">
          💼 {job.type}
        </p>

        <p className="mb-3">
          💰 {job.salary}
        </p>

        <Link
          to={`/jobs/${job.id}`}
          className="btn btn-primary"
        >
          View Details
        </Link>

      </div>

    </div>
  );
}

export default JobCard;