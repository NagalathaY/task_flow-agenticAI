import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "./login";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({ meta: [{ title: "Sign Up · Mycelia.AI" }] }),
});

function SignupPage() {
  return <AuthShell mode="signup" />;
}
