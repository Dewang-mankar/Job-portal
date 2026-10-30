
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyApplications from "./pages/MyApplications";
import ApplicationForm from "./pages/ApplicationForm";
import About from "./pages/About";

import AdminDashboard from "./pages/admin/Dashboard";
import ManageJobs from "./pages/admin/ManageJobs";
import Applicants from "./pages/admin/Applicants";

import RecruiterRoute from "./components/RecruiterRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RoleDashboard() {
    const { user } = useAuth();

    if (user?.role === "recruiter") {
        return <Navigate to="/admin" replace />;
    }

    return <Dashboard />;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />

                <ToastContainer
                    position="top-right"
                    autoClose={1000}
                    theme="colored"
                />

                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/jobs" element={<Jobs />} />

                    <Route
                        path="/jobs/:id"
                        element={<JobDetails />}
                    />

                    <Route
                        path="/jobs/:id/apply"
                        element={
                            <ProtectedRoute>
                                <ApplicationForm />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/login" element={<Login />} />

                    <Route path="/register" element={<Register />} />

                    <Route path="/about" element={<About />} />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <RoleDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/applications"
                        element={
                            <ProtectedRoute>
                                <MyApplications />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <RecruiterRoute>
                                <AdminDashboard />
                            </RecruiterRoute>
                        }
                    />

                    <Route
                        path="/admin/jobs"
                        element={
                            <RecruiterRoute>
                                <ManageJobs />
                            </RecruiterRoute>
                        }
                    />

                    <Route
                        path="/admin/applicants"
                        element={
                            <RecruiterRoute>
                                <Applicants />
                            </RecruiterRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
