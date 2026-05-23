"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function LoginPage() {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated]);

  useEffect(() => {
    clearError();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.usernameOrEmail, form.password);
    if (result.success) router.push("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-up">
        {/* Logo */}
        <div className="auth-logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">VirtualWorld</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your world</p>

        {error && (
          <div className="error-banner">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label className="field-label">Username or Email</label>
            <input
              className="input-field"
              name="usernameOrEmail"
              value={form.usernameOrEmail}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="username"
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <input
              className="input-field"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <button className="btn-primary" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          No account?{" "}
          <Link href="/register" className="auth-link">
            Create one
          </Link>
        </p>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-deep);
          padding: 20px;
          background-image: radial-gradient(ellipse at 30% 20%, rgba(124, 90, 255, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 80%, rgba(124, 90, 255, 0.05) 0%, transparent 50%);
        }
        .auth-card {
          width: 100%;
          max-width: 400px;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 40px;
        }
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
        }
        .logo-icon {
          font-size: 24px;
          color: var(--accent);
        }
        .logo-text {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--text-primary);
        }
        .auth-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 6px;
        }
        .auth-subtitle {
          font-size: 13px;
          color: var(--text-secondary);
          margin: 0 0 28px;
        }
        .error-banner {
          background: rgba(244, 63, 94, 0.1);
          border: 1px solid rgba(244, 63, 94, 0.3);
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 13px;
          color: #f43f5e;
          margin-bottom: 20px;
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field-label {
          font-size: 12px;
          color: var(--text-secondary);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .auth-footer {
          text-align: center;
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 24px;
          margin-bottom: 0;
        }
        .auth-link {
          color: var(--accent);
          text-decoration: none;
        }
        .auth-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
