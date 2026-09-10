import type { ReactNode } from "react";

import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminNav />
      <main id="main-content" className="min-w-0 flex-1 overflow-x-hidden p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
