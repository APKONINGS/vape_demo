import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { isGoogleOAuthConfigured } from "@/lib/env";

export default function AdminLoginPage() {
  return <AdminLoginForm googleEnabled={isGoogleOAuthConfigured()} />;
}
