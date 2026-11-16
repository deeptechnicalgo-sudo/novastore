"use client";

import "./Signin.css";
import { signIn } from "next-auth/react";
import { RegisterLink as Reg } from "@kinde-oss/kinde-auth-nextjs/components";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CartDrawer from "../../components/CartDrawer";

export default function SignUpPage() {
    const [password, setpassword] = useState("");
    const [cpassword, setcpassword] = useState("");
    const [email, setemail] = useState("");
    const [Name, setname] = useState("");
    const [ischceked, setcheck] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isNameValid = Name.trim().length >= 3;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const isChar8 = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const isConfirmValid = cpassword.length > 0 && password === cpassword;
    const isPasswordValid = isChar8 && hasNumber && hasSymbol && hasUpper && hasLower;
    const isFormValid = isNameValid && isEmailValid && isPasswordValid && isConfirmValid && ischceked;
    const passedRules = [isChar8, hasNumber, hasSymbol, hasUpper, hasLower].filter(Boolean).length;

    const colors = {
        nameisnot: Name.length === 0 ? "inherit" : isNameValid ? "#16a34a" : "#dc2626",
        name: Name.length === 0 ? "inherit" : isNameValid ? "#16a34a" : "#dc2626",
        email: email.length === 0 ? "inherit" : isEmailValid ? "#16a34a" : "#dc2626",
        char8: password.length === 0 ? "inherit" : isChar8 ? "#16a34a" : "#dc2626",
        number: password.length === 0 ? "inherit" : hasNumber ? "#16a34a" : "#dc2626",
        symbol: password.length === 0 ? "inherit" : hasSymbol ? "#16a34a" : "#dc2626",
        upper: password.length === 0 ? "inherit" : hasUpper ? "#16a34a" : "#dc2626",
        lower: password.length === 0 ? "inherit" : hasLower ? "#16a34a" : "#dc2626",
        confirmedpassword: cpassword.length === 0 ? "inherit" : isConfirmValid ? "#16a34a" : "#dc2626",
    };

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
                        <h1 className="card-title">Create your Atelier Account</h1>
                        <p className="card-subtitle">
                            Join the circle for archival access, private drops, and expedited checkout.
                        </p>
                    </div>

                    <div className="sso-group">

                        <button
                            className="sso-button"
                            type="button"
                            onClick={() => {
                                signIn("google", { callbackUrl: "/add-password", redirectTo: "/add-password" });
                            }}
                        >
                            <svg className="sso-icon" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"></path>
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"></path>
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                    fill="#FBBC05"></path>
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                    fill="#EA4335"></path>
                            </svg>
                            <span>Continue with Google</span>
                        </button>

                        <Reg postLoginRedirectURL="/add-password">
                            <button className="sso-button" type="button">
                                <svg className="sso-icon apple-icon" viewBox="0 0 24 24">
                                    <path
                                        d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.65-.8 1.1-1.92.97-3.04-.95.04-2.11.64-2.79 1.44-.59.69-1.12 1.83-.98 2.92 1.06.08 2.15-.52 2.8-1.32">
                                    </path>
                                </svg>
                                <span>Continue with Apple</span>
                            </button>
                        </Reg>
                    </div>

                    <div className="form-divider">
                        <div className="divider-line"></div>
                        <span className="divider-text">OR REGISTER WITH EMAIL</span>
                    </div>

                    {error && (
                        <div style={{
                            padding: "0.75rem 1rem",
                            marginBottom: "1rem",
                            backgroundColor: "#fef2f2",
                            border: "1px solid #fecaca",
                            borderRadius: "0.375rem",
                            color: "#dc2626",
                            fontSize: "13px"
                        }}>
                            {error}
                        </div>
                    )}

                    <form className="signup-form" onSubmit={async (e) => {
                        e.preventDefault();
                        if (!isFormValid || loading) return;
                        setLoading(true);
                        setError("");

                        try {
                            const response = await fetch("/api/userSignup", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    password,
                                    cpassword,
                                    name: Name,
                                    email,
                                    check: ischceked
                                }),
                            });

                            const data = await response.json();
                            if (!response.ok || data.Stat !== "good") {
                                setError(data.error || "Failed to create account");
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
                    }}>

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
                                onChange={(e) => setname(e.target.value)}
                            />
                            <p className="strength-caption">
                                <span className="strength-bullet"></span>
                                <span style={{ color: `${colors.nameisnot}` }}> at least 3 characters,</span>
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
                                onChange={(e) => setemail(e.target.value)}
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
                                    onChange={(e) => setpassword(e.target.value)}
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
                                onChange={(e) => setcpassword(e.target.value)}
                            />
                            <p className="strength-caption">
                                <span className="strength-bullet"></span>
                                <span style={{ color: colors.confirmedpassword }}> Passwords match</span>
                            </p>
                        </div>

                        <div className="checkbox-container">
                            <label className="checkbox-label">
                                <input
                                    checked={ischceked}
                                    className="checkbox-input"
                                    type="checkbox"
                                    onChange={(e) => setcheck(e.target.checked)}
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
                                <span>{loading ? "Creating Account..." : "Create Account"}</span>
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
