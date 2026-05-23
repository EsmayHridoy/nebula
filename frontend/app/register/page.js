"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const { register, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated]);

  useEffect(() => {
    clearError();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    if (error) clearError();
  };

  const validate = () => {
    const errors = {};
    if (form.username.length < 3) errors.username = "Min 3 characters";
    if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Invalid email";
    if (form.password.length < 8) errors.password = "Min 8 characters";
    if (form.password !== form.confirmPassword) errors.confirmPassword = "Passwords don't match";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const result = await register({
      username: form.username,
      email: form.email,
      password: form.password,
      displayName: form.displayName || form.username,
    });

    if (result.success) router.push("/dashboard");
  };

  const fields = [
    { name: "username", label: "Username", placeholder: "cooluser", type: "text", autoComplete: "username" },
    { name: "email", label: "Email", placeholder: "you@example.com", type: "email", autoComplete: "email" },
    { name: "displayName", label: "Display Name (optional)", placeholder: "Cool User", type: "text", autoComplete: "name" },
    { name: "password", label: "Password", placeholder: "Min 8 characters", type: "password", autoComplete: "new-password" },
    { name: "confirmPassword", label: "Confirm Password", placeholder: "••••••••", type: "password", autoComplete: "new-password" },
  ];

  return (
    <div className="auth-page">
      <div className="auth-card fade-up">
        <div className="auth-logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">VirtualWorld</span>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join the virtual world</p>

        {error && (
          <div className="error-banner">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {fields.map((field) => (
            <div key={field.name} className="field-group">
              <label className="field-label">{field.label}</label>
              <input
                className="input-field"
                name={field.name}
                type={field.type}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
              />
              {fieldErrors[field.name] && (
                <span className="field-error">{fieldErrors[field.name]}</span>
              )}
            </div>
          ))}

          <button className="btn-primary" type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link href="/login" className="auth-link">
            Sign in
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
          background-image: radial-gradient(ellipse at 70% 20%, rgba(124, 90, 255, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 30% 80%, rgba(124, 90, 255, 0.05) 0%, transparent 50%);
        }
        .auth-card {
          width: 100%;
          max-width: 420px;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 40px;
        }
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
        }
        .logo-icon { font-size: 24px; color: var(--accent); }
        .logo-text { font-size: 16px; font-weight: 700; letter-spacing: 0.1em; }
        .auth-title { font-size: 22px; font-weight: 700; margin: 0 0 6px; }
        .auth-subtitle { font-size: 13px; color: var(--text-secondary); margin: 0 0 24px; }
        .error-banner {
          background: rgba(244, 63, 94, 0.1);
          border: 1px solid rgba(244, 63, 94, 0.3);
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 13px;
          color: #f43f5e;
          margin-bottom: 18px;
          display: flex;
          gap: 8px;
        }
        .auth-form { display: flex; flex-direction: column; gap: 14px; }
        .field-group { display: flex; flex-direction: column; gap: 5px; }
        .field-label { font-size: 11px; color: var(--text-secondary); letter-spacing: 0.05em; text-transform: uppercase; }
        .field-error { font-size: 11px; color: var(--error); }
        .auth-footer { text-align: center; font-size: 13px; color: var(--text-muted); margin-top: 22px; margin-bottom: 0; }
        .auth-link { color: var(--accent); text-decoration: none; }
        .auth-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
