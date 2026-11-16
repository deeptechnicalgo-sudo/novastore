"use client";

import "../signup/Signin.css";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CartDrawer from "../../components/CartDrawer";

export default function AddPasswordClient({ initialName = "", initialEmail = "" }) {
    const [Name, setName] = useState(initialName);
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(true);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!Name) {
            const storedName = localStorage.getItem("Name");
            if (storedName) setName(storedName);
        }
        if (!email) {
            const storedEmail = localStorage.getItem("email");
            if (storedEmail) setEmail(storedEmail);
        }
    }, [Name, email]);

    const isNameValid = Name.trim().length >= 3;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const isChar8 = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const isConfirmValid = cpassword.length > 0 && password === cpassword;
    const isPasswordValid = isChar8 && hasNumber && hasSymbol && hasUpper && hasLower;
    const isFormValid = isNameValid && isEmailValid && isPasswordValid && isConfirmValid && isChecked;
    const passedRules = [isChar8, hasNumber, hasSymbol, hasUpper, hasLower].filter(Boolean).length;

    const colors = {
        name: Name.length === 0 ? "inherit" : isNameValid ? "#16a34a" : "#dc2626",
        email: email.length === 0 ? "inherit" : isEmailValid ? "#16a34a" : "#dc2626",
        char8: password.length === 0 ? "inherit" : isChar8 ? "#16a34a" : "#dc2626",
        number: password.length === 0 ? "inherit" : hasNumber ? "#16a34a" : "#dc2626",
        symbol: password.length === 0 ? "inherit" : hasSymbol ? "#16a34a" : "#dc2626",
        upper: password.length === 0 ? "inherit" : hasUpper ? "#16a34a" : "#dc2626",
        lower: password.length === 0 ? "inherit" : hasLower ? "#16a34a" : "#dc2626",
        confirmedpassword: cpassword.length === 0 ? "inherit" : isConfirmValid ? "#16a34a" : "#dc2626",
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (!isFormValid || loading) return;
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/addPassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: Name,
                    email,
                    password,
                    cpassword,
                }),
            });

            const data = await response.json();
            if (!response.ok || data.stat !== "good") {
                setError(data.error || "Failed to set password");
                setLoading(false);
                return;
            }

            localStorage.setItem("user", JSON.stringify({ username: Name, emailaddress: email }));
            localStorage.setItem("email", email);
            localStorage.setItem("Name", Name);
            window.location.href = "/Collections";
        } catch (err) {
            setError("Network error occurred");
            setLoading(false);
        }
    }

    return (
        <div>
            <Header />

            <main className="signup-canvas">
                <div className="canvas-background-grid">
                    <div className="background-grid-inner">
                        <div className="grid-col-left"></div>
                        <div className="grid-col-center"></div>
                        <div className="grid-col-right"></div>
                    </div>
                </div>

                <div className="signup-card">
                    <div className="card-header">
                        <span className="brand-eyebrow">NOVA STORE</span>
                        <h1 className="card-title">Set Atelier Password</h1>
                        <p className="card-subtitle">
                            Create a secure password to finalize your account and access NOVA Collections.
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            padding: "0.75rem 1rem",
                            marginBottom: "1.25rem",
                            backgroundColor: "#fef2f2",
                            border: "1px solid #fecaca",
                            borderRadius: "0.375rem",
                            color: "#dc2626",
                            fontSize: "13px"
                        }}>
                            {error}
                        </div>
                    )}

                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="full-name">
                                Full Name
                            </label>
                            <input
                                className="form-input"
                                id="full-name"
                                placeholder="Julian Vance"
                                type="text"
                                value={Name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <p className="strength-caption">
                                <span className="strength-bullet"></span>
                                <span style={{ color: colors.name }}> at least 3 characters,</span>
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                className="form-input"
                                id="email"
                                placeholder="julian.vance@studio-arch.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <p className="strength-caption">
                                <span className="strength-bullet"></span>
                                <span style={{ color: colors.email }}> Valid email address</span>
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">
                                Password
                            </label>
                            <div className="input-wrapper">
                                <input
                                    className="form-input"
                                    id="password"
                                    placeholder="******"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    aria-label="Toggle password visibility"
                                    className="password-toggle-btn"
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    <span className="material-symbols-outlined" data-icon="visibility">
                                        {showPassword ? "visibility_off" : "visibility"}
                                    </span>
                                </button>
                            </div>

                            <div className="password-strength-container">
                                <div className="strength-bars">
                                    <div className={`strength-bar ${passedRules >= 1 ? "active" : ""}`}></div>
                                    <div className={`strength-bar ${passedRules >= 3 ? "active" : ""}`}></div>
                                    <div className={`strength-bar ${passedRules === 5 ? "active" : ""}`}></div>
                                </div>
                                <p className="strength-caption">
                                    <span className="strength-bullet"></span>
                                    <span style={{ color: colors.char8 }}>At least 8 characters,</span>
                                    <span style={{ color: colors.number }}>1 number,</span>
                                    <span style={{ color: colors.symbol }}>1 symbol ,</span>
                                    <span style={{ color: colors.upper }}>1 uppercase ,</span>
                                    <span style={{ color: colors.lower }}>1 lowercase</span>
                                </p>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="confirm-password">
                                Confirm Password
                            </label>
                            <input
                                className="form-input"
                                id="confirm-password"
                                placeholder="********"
                                type={showPassword ? "text" : "password"}
                                value={cpassword}
                                onChange={(e) => setCpassword(e.target.value)}
                            />
                            <p className="strength-caption">
                                <span className="strength-bullet"></span>
                                <span style={{ color: colors.confirmedpassword }}> Passwords match</span>
                            </p>
                        </div>

                        <div className="checkbox-container">
                            <label className="checkbox-label">
                                <input
                                    checked={isChecked}
                                    className="checkbox-input"
                                    type="checkbox"
                                    onChange={(e) => setIsChecked(e.target.checked)}
                                />
                                <span className="checkbox-text">
                                    Subscribe to the NOVA Journal for private exhibitions, design monographs, and collection previews.
                                </span>
                            </label>
                        </div>

                        <div>
                            <p className="terms-text">
                                By creating an account, you agree to our
                                <a className="terms-link" href="#"> Terms of Service </a>
                                and
                                <a className="terms-link" href="#"> Privacy Policy</a>.
                            </p>
                        </div>

                        <div className="submit-button-container">
                            <button
                                className="btn-submit"
                                type="submit"
                                disabled={!isFormValid || loading}
                                style={{
                                    opacity: isFormValid && !loading ? 1 : 0.45,
                                    cursor: isFormValid && !loading ? "pointer" : "not-allowed",
                                    transition: "opacity 0.2s ease",
                                }}
                            >
                                <span>{loading ? "Saving..." : "Create Account & Sign In"}</span>
                                <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
                            </button>
                        </div>

                        <div className="auth-switch">
                            <p className="switch-text">
                                Already have an account?
                                <a className="switch-link" href="/sing">
                                    Sign In
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
            <CartDrawer />
        </div>
    );
}

