"use client";

import { useState } from "react";
import "./SignIn.css";
import { signIn } from "next-auth/react";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CartDrawer from "../../components/CartDrawer";

export default function SignInPage() {
    const [password, setpassword] = useState("");
    const [email, setemail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <div>
            <Header />

            <main className="main-content">
                <div className="ambient-bg"></div>
                <div className="auth-card">

                    <div className="auth-header">
                        <span className="badge-dot"></span>
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">
                            Sign in to access your curated orders, saved items, and concierge services.
                        </p>
                    </div>

                    <div className="social-auth-stack">
                        <button
                            className="social-btn"
                            type="button"
                            onClick={() => {
                                signIn("google", { callbackUrl: "/add-password", redirectTo: "/add-password" });
                            }}
                        >
                            <svg className="social-icon" viewBox="0 0 24 24">
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
                        <LoginLink postLoginRedirectURL="/add-password">
                            <button className="social-btn" type="button" style={{ width: "100%" }}>
                                <svg className="social-icon" fill="#000000" viewBox="0 0 170 170">
                                    <path
                                        d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.75-11.96-14.12-6.52-9.78-11.66-21.2-15.42-34.25-3.76-13.06-5.64-25.29-5.64-36.7 0-14.78 3.65-27.24 10.96-37.38 7.31-10.13 16.5-15.34 27.56-15.62 5.09 0 10.42 1.34 15.99 4.02 5.57 2.68 9.53 4.07 11.89 4.17 2.06 0 6.09-1.45 12.08-4.35 5.99-2.9 11.19-4.24 15.6-4.02 12.18.66 21.84 5.37 28.98 14.14-10.66 6.42-15.89 15.44-15.69 27.08.2 9.03 3.62 16.74 10.26 23.14 6.64 6.4 14.48 10.02 23.51 10.86-2.17 6.42-4.99 13.06-8.45 19.92zM119.22 31.81c0-7.39 2.68-14.54 8.04-21.46 5.36-6.92 12.01-11.23 19.95-12.93.33 1.1.49 2.29.49 3.58 0 7.39-2.78 14.7-8.34 21.93-5.56 7.23-12.38 11.51-20.46 12.83-.22-1.32-.33-2.64-.33-3.95z">
                                    </path>
                                </svg>
                                <span>Continue with Apple</span>
                            </button>
                        </LoginLink>
                    </div>

                    <div className="divider-row">
                        <div className="divider-line"></div>
                        <span className="divider-text">OR SIGN IN WITH EMAIL</span>
                        <div className="divider-line"></div>
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

                    <form className="auth-form" onSubmit={async (e) => {
                        e.preventDefault();
                        setError("");
                        setLoading(true);
                        try {
                            const response = await fetch("/api/userSignin", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    email: email,
                                    password: password
                                }),
                            });

                            const data = await response.json();
                            if (!response.ok || data.stat === "bad") {
                                setError(data.error || "Wrong email or password");
                                setLoading(false);
                                return;
                            }

                            if (data.data && data.data[0]) {
                                localStorage.setItem("user", JSON.stringify(data.data[0]));
                                localStorage.setItem("email", data.data[0].emailaddress);
                                localStorage.setItem("Name", data.data[0].username);
                            }
                            window.location.href = "/Collections";
                        } catch (err) {
                            setError("Network error occurred");
                            setLoading(false);
                        }
                    }}>
                        <div className="input-wrapper">
                            <input
                                className="form-input"
                                id="email"
                                name="email"
                                placeholder=" "
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                            />
                            <label className="form-label" htmlFor="email">Email address</label>
                        </div>
                        <div className="input-wrapper">
                            <input
                                className="form-input form-input-password"
                                id="password"
                                name="password"
                                placeholder=" "
                                required
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                            />
                            <label className="form-label" htmlFor="password">Password</label>
                            <button
                                aria-label="Toggle password visibility"
                                className="toggle-visibility-btn"
                                id="togglePassword"
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                <span className="material-symbols-outlined" data-icon="visibility" id="togglePasswordIcon">
                                    {showPassword ? "visibility_off" : "visibility"}
                                </span>
                            </button>
                        </div>

                        <div className="meta-row">
                            <label className="checkbox-label">
                                <input className="form-checkbox" name="remember" type="checkbox" defaultChecked />
                                <span className="checkbox-text">Remember this device</span>
                            </label>
                            <a className="forgot-link" href="#">Forgot password?</a>
                        </div>

                        <button className="submit-btn" type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                            <span>{loading ? "Signing In..." : "Sign In"}</span>
                            <span className="arrow-icon">→</span>
                        </button>
                    </form>

                    <div className="account-switch-row">
                        <p className="account-switch-text">
                            Don’t have a NOVA account?
                            <a className="register-link" href="/signup">Create one now</a>
                        </p>
                    </div>

                </div>
            </main>

            <Footer />
            <CartDrawer />
        </div>
    );
}
