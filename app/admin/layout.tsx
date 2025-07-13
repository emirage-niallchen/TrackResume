import { cn } from "@/lib/utils";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="flex h-[calc(100vh-4rem)]">
        <AdminSidebar />
        <main className={cn(
          "flex-1 overflow-y-auto p-6",
          "bg-white shadow-sm rounded-lg m-4"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
} 