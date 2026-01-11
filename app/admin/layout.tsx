import { cn } from "@/lib/utils";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminContentLanguageProvider from "@/lib/context/AdminContentLanguageProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminContentLanguageProvider>
      <div className="h-screen bg-gray-100 overflow-hidden fixed inset-0">
        <AdminHeader />
        <div className="flex h-[calc(100vh-3.5rem)] pt-14">
          <AdminSidebar />
          <main className={cn(
            "flex-1 overflow-y-auto",
            "bg-white shadow-sm rounded-lg m-4 p-6"
          )}>
            {children}
          </main>
        </div>
      </div>
    </AdminContentLanguageProvider>
  );
} 