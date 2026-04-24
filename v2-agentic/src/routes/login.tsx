import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Login · Mycelia.AI" }] }),
});

function LoginPage() {
  return <AuthShell mode="login" />;
}

export function AuthShell({ mode }: { mode: "login" | "signup" }) {
  const isLogin = mode === "login";
  return (
    <div className="min-h-dvh grid lg:grid-cols-2 bg-background">
      {/* Visual side */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-border">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-primary/15 blur-[120px]" />
        <Link to="/" className="relative flex items-center gap-3">
          <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center glow-primary">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">Mycelia.AI</span>
        </Link>
        <div className="relative space-y-6 max-w-md">
          <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-primary">Agentic Club OS</div>
          <h2 className="text-4xl font-light leading-tight">
            Where <span className="text-primary text-glow">AI agents</span> orchestrate your club's pulse.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            LangGraph-driven task decomposition, ChromaDB memory recall, and skill-vector member matching — all living inside one breathing dashboard.
          </p>
          <div className="flex gap-2">
            {["Task", "Event", "Member", "Notification"].map((a) => (
              <div key={a} className="px-3 py-1.5 rounded-full bg-card border border-border text-xs font-mono text-muted-foreground">
                {a}_Agent
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          system · nominal · uptime 48h 12m
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary">
              {isLogin ? "Re-authenticate" : "Initialize node"}
            </div>
            <h1 className="text-3xl font-light tracking-tight">
              {isLogin ? "Welcome back." : "Join the network."}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Enter the orchestrator." : "Spin up your agentic workspace in seconds."}
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Silas Thorne" className="h-11 bg-card" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@club.ai" className="h-11 bg-card" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" className="h-11 bg-card" />
            </div>

            <Button type="submit" className="w-full h-11 bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary rounded-full">
              {isLogin ? "Enter Orchestrator" : "Create Account"}
            </Button>
          </form>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <span className="relative bg-background px-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">or</span>
          </div>

          <Button variant="outline" className="w-full h-11 rounded-full border-border bg-card hover:bg-accent">
            Continue with Google
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            {isLogin ? (
              <>Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link></>
            ) : (
              <>Already orchestrating? <Link to="/login" className="text-primary hover:underline">Log in</Link></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
