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
      <main className="flex-1 w-full animate-fade-in px-4 md:px-7 py-6 md:py-7 pb-24 md:pl-64">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
