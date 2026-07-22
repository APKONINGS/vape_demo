import { LoginForm } from "@/components/login-form";
import { isGoogleOAuthConfigured } from "@/lib/env";

export default function LoginPage() {
  return <LoginForm googleEnabled={isGoogleOAuthConfigured()} />;
}
