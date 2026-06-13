import { Sidebar } from "@/components/layout/Sidebar";
import { ToastContainer } from "@/components/ui/Toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-bg-base">
      <Sidebar />
      <main
        className="flex-1 overflow-y-auto w-full animate-fade-in"
        style={{
          padding: "28px 32px",
          maxWidth: 1100,
          margin: "0 auto",
          paddingBottom: 84,
        }}
      >
        {children}
      </main>
      <ToastContainer />
    </div>
  );
}
