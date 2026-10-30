import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RecruiterRoute({ children }) {

    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "recruiter") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default RecruiterRoute;