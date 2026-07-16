"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  // Shield,
  Palette,
  // Download,
  Trash2,
  AlertTriangle,
  Check,
  Loader2,
  // ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/presentation/auth/AuthContext";
import { useUpdateProfile } from "@/lib/presentation/hooks/useProfile";
import { useDeleteAccount } from "@/lib/presentation/hooks/useDeleteAccount";
import { useTheme, type Theme } from "@/lib/presentation/theme/ThemeContext";
import { toast } from "@/components/ui/Toast";

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-bg-surface rounded-xl border border-border ${className}`}
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div
        className="flex items-center justify-center shrink-0 mt-0.5"
        style={{
          width: 32,
          height: 32,
          borderRadius: "var(--radius-md)",
          backgroundColor: "var(--accent-subtle)",
        }}
      >
        <Icon size={16} className="text-accent" />
      </div>
      <div>
        <h3
          className="font-display font-semibold"
          style={{ fontSize: 15, color: "var(--text-primary)" }}
        >
          {title}
        </h3>
        <p
          style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "var(--text-primary)",
          }}
        >
          {label}
        </p>
        {description && (
          <p
            style={{
              fontSize: 12,
              color: "var(--text-secondary)",
              marginTop: 2,
            }}
          >
            {description}
          </p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// Toggle component - uncomment when re-enabling preference settings
// function Toggle({
//   checked,
//   onChange,
// }: {
//   checked: boolean;
//   onChange: (v: boolean) => void;
// }) {
//   return (
//     <button
//       type="button"
//       role="switch"
//       aria-checked={checked}
//       onClick={() => onChange(!checked)}
//       className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
//       style={{
//         backgroundColor: checked ? "var(--accent)" : "var(--border-strong)",
//       }}
//     >
//       <span
//         className="pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm transition-transform duration-200"
//         style={{
//           transform: checked ? "translateX(20px)" : "translateX(2px)",
//           marginTop: 2,
//         }}
//       />
//     </button>
//   );
// }

function DeleteAccountZone() {
  const { logout } = useAuth();
  const router = useRouter();
  const deleteAccount = useDeleteAccount();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const isConfirmed = confirmText === "DELETE";

  return (
    <SectionCard className="border-danger/20">
      <div className="p-5 md:p-6">
        <SectionHeader
          icon={AlertTriangle}
          title="Danger Zone"
          description="Permanently delete your account and all associated data."
        />

        <div
          className="rounded-lg p-4 mb-4"
          style={{
            backgroundColor: "var(--danger-subtle)",
            border: "1px solid rgba(220, 38, 38, 0.1)",
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            Deleting your account will permanently remove all your application
            data, resumes, generated documents, and score results. This action
            cannot be undone.
          </p>
        </div>

        {!confirmOpen ? (
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={14} />}
            onClick={() => setConfirmOpen(true)}
          >
            Delete Account
          </Button>
        ) : (
          <div className="space-y-3">
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Type{" "}
              <span className="font-mono font-semibold text-danger">
                DELETE
              </span>{" "}
              to confirm:
            </p>
            <div className="flex items-end gap-3">
              <div className="flex-1 max-w-xs">
                <Input
                  placeholder='Type "DELETE"'
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="!border-danger/30 focus:!border-danger focus:!shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  disabled={!isConfirmed || deleteAccount.isPending}
                  icon={
                    deleteAccount.isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : isConfirmed ? (
                      <Check size={14} />
                    ) : undefined
                  }
                  onClick={() =>
                    deleteAccount.mutate(undefined, {
                      onSuccess: async () => {
                        toast("success", "Account deleted");
                        await logout();
                        router.push("/");
                      },
                      onError: (err) =>
                        toast("error", err.message || "Failed to delete account"),
                    })
                  }
                >
                  {deleteAccount.isPending ? "Deleting…" : "Confirm"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={deleteAccount.isPending}
                  onClick={() => {
                    setConfirmOpen(false);
                    setConfirmText("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const { theme, setTheme } = useTheme();

  const [displayName, setDisplayName] = useState(user?.name ?? "");

  useEffect(() => {
    setDisplayName(user?.name ?? "");
  }, [user?.name]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="font-display font-semibold"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 24,
            lineHeight: 1.2,
            color: "var(--text-primary)",
          }}
        >
          Settings
        </h1>
        <p
          style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}
        >
          Manage your account and application preferences.
        </p>
      </div>

      <div className="space-y-8">
        {/* Account */}
        <section>
          <SectionCard>
            <div className="p-5 md:p-6">
              <SectionHeader
                icon={User}
                title="Account"
                description="Your account details and connected services."
              />

              <div className="space-y-4 mb-6">
                <Input
                  label="Display name"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  hint="Used in generated documents and application headers."
                />
                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!displayName.trim() || updateProfile.isPending}
                    icon={
                      updateProfile.isPending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : undefined
                    }
                    onClick={() =>
                      updateProfile.mutate(displayName.trim(), {
                        onSuccess: (updatedUser) => {
                          setDisplayName(updatedUser.name ?? "");
                          toast("success", "Display name updated");
                        },
                        onError: () =>
                          toast("error", "Failed to update display name"),
                      })
                    }
                  >
                    {updateProfile.isPending ? "Saved" : "Save"}
                  </Button>
                </div>
                <Input
                  label="Email"
                  value={user?.email ?? ""}
                  disabled
                  leftIcon={<Mail size={14} />}
                  hint="Managed by your authentication provider."
                />
              </div>

              <div
                className="pt-5"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    marginBottom: 12,
                  }}
                >
                  Connected accounts
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--bg-muted)",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--text-primary)",
                      }}
                    >
                      Google
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                      OAuth sign-in provider
                    </p>
                  </div>
                  <span
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full"
                    style={{
                      backgroundColor: "var(--success-subtle)",
                      color: "var(--success)",
                    }}
                  >
                    <Check size={12} />
                    Connected
                  </span>
                </div>
              </div>
            </div>
          </SectionCard>
        </section>

        {/* Preferences */}
        <section>
          <SectionCard>
            <div className="p-5 md:p-6">
              <SectionHeader
                icon={Palette}
                title="Preferences"
                description="Customize how JATA looks and behaves."
              />

              <div className="space-y-1">
                <SettingRow
                  label="Appearance"
                  description="Switch between light, dark, or system theme."
                >
                  <select
                    className="h-8 px-2 text-xs rounded-md border border-border bg-bg-muted text-text-primary focus:outline-none focus:border-accent"
                    style={{ fontFamily: "var(--font-inter)" }}
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as Theme)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </SettingRow>

                {/*
                <SettingRow
                  label="Default document tone"
                  description="The tone used when generating cover letters and emails."
                >
                  <select
                    className="h-8 px-2 text-xs rounded-md border border-border bg-bg-muted text-text-primary focus:outline-none focus:border-accent"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="concise">Concise</option>
                  </select>
                </SettingRow>

                <SettingRow
                  label="Auto-save generated documents"
                  description="Automatically save AI-generated documents to your library."
                >
                  <Toggle checked={false} onChange={() => {}} />
                </SettingRow>

                <SettingRow
                  label="Email notifications"
                  description="Get notified about application status changes."
                >
                  <Toggle checked={false} onChange={() => {}} />
                </SettingRow>

                <SettingRow
                  label="Weekly job search digest"
                  description="Receive a summary of your job search activity each week."
                >
                  <Toggle checked={false} onChange={() => {}} />
                </SettingRow>
                */}
              </div>
            </div>
          </SectionCard>
        </section>

        {/* Data & Privacy
        <section>
          <SectionCard>
            <div className="p-5 md:p-6">
              <SectionHeader
                icon={Shield}
                title="Data & Privacy"
                description="Export your data or review how it is handled."
              />

              <div className="space-y-1">
                <SettingRow
                  label="Export all data"
                  description="Download a copy of your applications, resumes, and generated documents."
                >
                  <Button variant="outline" size="sm" icon={<Download size={14} />}>
                    Export
                  </Button>
                </SettingRow>

                <div className="py-3.5">
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
                  >
                    View privacy policy
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </SectionCard>
        </section>
        */}

        {/* Danger Zone */}
        <section>
          <DeleteAccountZone />
        </section>
      </div>
    </div>
  );
}
