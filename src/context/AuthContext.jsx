import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("hireflow_user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const register = (name, email, password, details = {}) => {
        const users = JSON.parse(
            localStorage.getItem("hireflow_users") || "[]"
        );

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = users.find(
            (existing) =>
                existing.email?.toLowerCase() === normalizedEmail ||
                (details.phone && existing.phone === details.phone)
        );

        if (existingUser) return false;

        const newUser = {
            id: Date.now(),
            name,
            email: normalizedEmail,
            password,
            role: "candidate",
            ...details
        };

        users.push(newUser);
        localStorage.setItem("hireflow_users", JSON.stringify(users));

        return true;
    };

    const login = (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();

        let matchedUser;

        if (
            normalizedEmail === "admin@gmail.com" &&
            password === "Admin@1234"
        ) {
            matchedUser = {
                id: "admin",
                name: "Admin",
                email: "admin@gmail.com",
                role: "recruiter"
            };
        } else {
            const users = JSON.parse(
                localStorage.getItem("hireflow_users") || "[]"
            );

            matchedUser = users.find(
                (account) =>
                    account.email?.toLowerCase() === normalizedEmail &&
                    account.password === password
            );
        }

        if (!matchedUser) return false;

        setUser(matchedUser);
        localStorage.setItem("hireflow_user", JSON.stringify(matchedUser));

        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("hireflow_user");
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
