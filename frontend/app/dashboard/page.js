"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import AuthGuard from "@/components/auth/AuthGuard";

function DashboardContent() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const rooms = [
    { id: 1, name: "Coffee Shop", icon: "☕", desc: "Chill and chat", online: 8 },
    { id: 2, name: "Study Hall", icon: "📚", desc: "Focus together", online: 12 },
    { id: 3, name: "Park", icon: "🌳", desc: "Open hangout", online: 5 },
    { id: 4, name: "Rooftop", icon: "🌆", desc: "Evening vibes", online: 3 },
  ];

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">⬡</span>
          <span>VirtualWorld</span>
        </div>

        <nav className="sidebar-nav">
          <Link href="/dashboard" className="nav-item active">
            <span className="nav-icon">⊞</span> Rooms
          </Link>
          <Link href="/profile" className="nav-item">
            <span className="nav-icon">◯</span> Profile
          </Link>
          <Link href="/friends" className="nav-item">
            <span className="nav-icon">◈</span> Friends
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar">
              {user?.displayName?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.displayName || user?.username}</span>
              <span className="user-handle">@{user?.username}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            ⇥
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <header className="main-header">
          <div>
            <h1 className="page-title">Rooms</h1>
            <p className="page-sub">Choose a space to hang out</p>
          </div>
          <div className="online-indicator">
            <span className="dot" /> 28 online
          </div>
        </header>

        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-icon">{room.icon}</div>
              <div className="room-info">
                <h3 className="room-name">{room.name}</h3>
                <p className="room-desc">{room.desc}</p>
              </div>
              <div className="room-footer">
                <span className="room-online">
                  <span className="dot green" /> {room.online}
                </span>
                <button className="join-btn">Enter</button>
              </div>
            </div>
          ))}
        </div>

        <div className="welcome-banner">
          <p className="welcome-text">
            Welcome back, <strong>{user?.displayName || user?.username}</strong>! 
            More rooms coming in Phase 3. 🚀
          </p>
        </div>
      </main>

      <style jsx>{`
        .dashboard {
          display: flex;
          min-height: 100vh;
          background: var(--bg-deep);
        }
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
          color: var(--text-primary);
          margin-bottom: 32px;
          padding: 0 4px;
        }
        .logo-icon { color: var(--accent); font-size: 20px; }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
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
        .nav-icon { font-size: 15px; opacity: 0.8; }
        .sidebar-footer {
          border-top: 1px solid var(--border);
          padding-top: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .user-chip { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
        .user-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--accent-dim);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }
        .user-info { display: flex; flex-direction: column; min-width: 0; }
        .user-name { font-size: 12px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-handle { font-size: 10px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .logout-btn {
          background: none;
          border: 1px solid var(--border);
          border-radius: 5px;
          color: var(--text-muted);
          padding: 5px 8px;
          font-size: 14px;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
        }
        .logout-btn:hover { color: var(--error); border-color: var(--error); }
        .main { flex: 1; padding: 32px; overflow-y: auto; }
        .main-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .page-title { font-size: 24px; font-weight: 700; margin: 0 0 4px; }
        .page-sub { font-size: 13px; color: var(--text-secondary); margin: 0; }
        .online-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-secondary);
          background: var(--bg-raised);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 6px 12px;
        }
        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          display: inline-block;
        }
        .dot.green { background: var(--success); }
        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }
        .room-card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: border-color 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .room-card:hover {
          border-color: var(--accent);
          box-shadow: 0 0 20px var(--accent-glow);
        }
        .room-icon { font-size: 28px; }
        .room-info { flex: 1; }
        .room-name { font-size: 15px; font-weight: 600; margin: 0 0 4px; }
        .room-desc { font-size: 12px; color: var(--text-secondary); margin: 0; }
        .room-footer { display: flex; align-items: center; justify-content: space-between; }
        .room-online { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text-muted); }
        .join-btn {
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 5px;
          padding: 6px 14px;
          font-size: 12px;
          font-family: inherit;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .join-btn:hover { background: #6b48ff; }
        .welcome-banner {
          background: var(--bg-raised);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 16px 20px;
        }
        .welcome-text { font-size: 13px; color: var(--text-secondary); margin: 0; }
        .welcome-text strong { color: var(--text-primary); }
      `}</style>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
