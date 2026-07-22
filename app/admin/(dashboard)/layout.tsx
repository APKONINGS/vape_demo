import type { ReactNode } from "react";

import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main id="main-content" className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
