import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000"
});

export const getJobs = () => api.get("/jobs");

export const getJobById = (id) => api.get(`/jobs/${id}`);

export const addJob = (job) => api.post("/jobs", job);

export const updateJob = (id, job) =>
    api.put(`/jobs/${id}`, job);

export const deleteJob = (id) =>
    api.delete(`/jobs/${id}`);

export const getApplications = () =>
    api.get("/applications");

export const addApplication = (application) =>
    api.post("/applications", application);

export default api;