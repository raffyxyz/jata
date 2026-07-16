"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Briefcase, FileText, FolderOpen, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/lib/presentation/auth/AuthContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: Briefcase },
  { href: "/resumes", label: "Resumes", icon: FileText },
  { href: "/documents", label: "Documents", icon: FolderOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

function getInitials(email: string): string {
  return email.charAt(0).toUpperCase();
}

function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const initials = user ? getInitials(user.email) : "?";

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-full bg-bg-surface z-40"
        style={{ width: 240, borderRight: "1px solid var(--border)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5" style={{ paddingTop: 20, paddingBottom: 24 }}>
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              backgroundColor: "var(--accent)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="9" y1="15" x2="15" y2="15" />
              <polyline points="12,12 9,15 12,18" />
            </svg>
          </div>
          <span
            className="font-display font-semibold text-text-primary"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18 }}
          >
            JATA
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 transition-all duration-120"
                style={{
                  height: 36,
                  padding: "0 10px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: "var(--font-inter)",
                  backgroundColor: active ? "var(--accent-subtle)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "var(--bg-muted)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <item.icon size={18} strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User area */}
        <div className="mt-auto px-5 pb-5">
          <div
            className="flex items-center gap-3 pt-4"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "var(--accent-subtle)",
                color: "var(--accent)",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="truncate"
                style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
              >
                {user?.email ?? "Loading..."}
              </p>
            </div>
            <button
              className="shrink-0 text-text-tertiary hover:text-text-secondary transition-colors"
              title="Sign out"
              onClick={handleLogout}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-surface z-40 flex items-center justify-around"
        style={{ height: 56, borderTop: "1px solid var(--border)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 transition-colors flex-1 h-full"
              style={{ color: active ? "var(--accent)" : "var(--text-tertiary)" }}
            >
              <item.icon size={20} strokeWidth={active ? 2 : 1.5} />
              <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export { Sidebar };
