// Known placeholder values shipped in .env.example / used during local build verification.
// If GOOGLE_ID/GOOGLE_SECRET still match one of these, Google sign-in isn't really wired up
// yet, so the UI hides the "Continue with Google" button instead of offering a dead end.
const PLACEHOLDER_GOOGLE_IDS = new Set([
  "dev-placeholder.apps.googleusercontent.com",
  "your-google-client-id.apps.googleusercontent.com",
]);

export function isGoogleOAuthConfigured(): boolean {
  const id = process.env.GOOGLE_ID;
  const secret = process.env.GOOGLE_SECRET;

  if (!id || !secret) return false;
  if (PLACEHOLDER_GOOGLE_IDS.has(id)) return false;

  return true;
}
