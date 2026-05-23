"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import AuthGuard from "@/components/auth/AuthGuard";

function ProfileContent() {
  const { user, updateProfile, logout, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  const [form, setForm] = useState({
    displayName: "",
    bio: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        displayName: user.displayName || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) clearError();
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(form);
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="profile-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">⬡</span>
          <span>VirtualWorld</span>
        </div>
        <nav className="sidebar-nav">
          <Link href="/dashboard" className="nav-item">
            <span>⊞</span> Rooms
          </Link>
          <Link href="/profile" className="nav-item active">
            <span>◯</span> Profile
          </Link>
          <Link href="/friends" className="nav-item">
            <span>◈</span> Friends
          </Link>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            ⇥ Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="main">
        <div className="profile-container fade-up">
          {/* Avatar area */}
          <div className="avatar-section">
            <div className="big-avatar">
              {user?.displayName?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="avatar-meta">
              <h2 className="display-name">{user?.displayName || user?.username}</h2>
              <p className="username-tag">@{user?.username}</p>
              <p className="join-date">Joined {joinedDate}</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="stats-row">
            <div className="stat">
              <span className="stat-val">{user?.role || "USER"}</span>
              <span className="stat-label">Role</span>
            </div>
            <div className="stat">
              <span className="stat-val">0</span>
              <span className="stat-label">Friends</span>
            </div>
            <div className="stat">
              <span className="stat-val">0</span>
              <span className="stat-label">Groups</span>
            </div>
          </div>

          <hr className="divider" />

          {/* Edit form */}
          <h3 className="section-title">Edit Profile</h3>

          {error && (
            <div className="error-banner">⚠ {error}</div>
          )}
          {saved && (
            <div className="success-banner">✓ Profile saved!</div>
          )}

          <form onSubmit={handleSubmit} className="edit-form">
            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Display Name</label>
                <input
                  className="input-field"
                  name="displayName"
                  value={form.displayName}
                  onChange={handleChange}
                  placeholder="Your name"
                  maxLength={100}
                />
              </div>
              <div className="field-group">
                <label className="field-label">Email</label>
                <input
                  className="input-field"
                  value={user?.email || ""}
                  disabled
                  style={{ opacity: 0.5, cursor: "not-allowed" }}
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Bio</label>
              <textarea
                className="input-field"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell people about yourself..."
                maxLength={300}
                rows={3}
                style={{ resize: "vertical" }}
              />
              <span className="char-count">{form.bio.length}/300</span>
            </div>

            <button className="btn-primary" type="submit" disabled={isLoading} style={{ width: "auto", alignSelf: "flex-start", padding: "10px 28px" }}>
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </main>

      <style jsx>{`
        .profile-page { display: flex; min-height: 100vh; background: var(--bg-deep); }
        .sidebar {
          width: 220px;
          flex-shrink: 0;
          background: var(--bg-surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.08em;
          margin-bottom: 32px;
          padding: 0 4px;
        }
        .logo-icon { color: var(--accent); font-size: 20px; }
        .sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 6px;
          font-size: 13px;
          color: var(--text-secondary);
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .nav-item:hover { background: var(--bg-raised); color: var(--text-primary); }
        .nav-item.active { background: var(--accent-glow); color: var(--accent); }
        .sidebar-footer { border-top: 1px solid var(--border); padding-top: 16px; }
        .logout-btn {
          width: 100%;
          background: none;
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-muted);
          padding: 8px 12px;
          font-size: 12px;
          font-family: inherit;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
        }
        .logout-btn:hover { color: var(--error); border-color: var(--error); }
        .main { flex: 1; padding: 40px; overflow-y: auto; }
        .profile-container {
          max-width: 600px;
          margin: 0 auto;
        }
        .avatar-section { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; }
        .big-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-dim), var(--accent));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }
        .display-name { font-size: 20px; font-weight: 700; margin: 0 0 3px; }
        .username-tag { font-size: 13px; color: var(--accent); margin: 0 0 4px; }
        .join-date { font-size: 11px; color: var(--text-muted); margin: 0; }
        .stats-row {
          display: flex;
          gap: 32px;
          margin-bottom: 24px;
        }
        .stat { display: flex; flex-direction: column; gap: 2px; }
        .stat-val { font-size: 16px; font-weight: 700; color: var(--text-primary); }
        .stat-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .divider { border: none; border-top: 1px solid var(--border); margin: 4px 0 24px; }
        .section-title { font-size: 14px; font-weight: 600; color: var(--text-primary); margin: 0 0 16px; letter-spacing: 0.05em; text-transform: uppercase; }
        .error-banner {
          background: rgba(244, 63, 94, 0.1);
          border: 1px solid rgba(244, 63, 94, 0.3);
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 13px;
          color: #f43f5e;
          margin-bottom: 16px;
        }
        .success-banner {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 13px;
          color: #22c55e;
          margin-bottom: 16px;
        }
        .edit-form { display: flex; flex-direction: column; gap: 16px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .field-group { display: flex; flex-direction: column; gap: 6px; }
        .field-label { font-size: 11px; color: var(--text-secondary); letter-spacing: 0.05em; text-transform: uppercase; }
        .char-count { font-size: 11px; color: var(--text-muted); text-align: right; }
      `}</style>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
