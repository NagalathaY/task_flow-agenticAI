import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, ListChecks, CalendarDays, Users, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/members", label: "Members", icon: Users },
  { to: "/notifications", label: "Notifications", icon: Bell },
] as const;

export function AgentSidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="w-60 shrink-0 hidden md:flex flex-col bg-card border-r border-border">
      <div className="h-16 flex items-center px-5 border-b border-border">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-primary grid place-items-center text-primary-foreground font-semibold text-sm">
            AI
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground leading-tight">AI Club</div>
            <div className="text-xs text-muted-foreground leading-tight">Workflow Manager</div>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        {nav.map((a) => {
          const active = path === a.to;
          const Icon = a.icon;
          return (
            <Link
              key={a.to}
              to={a.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              <span>{a.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-3 border-t border-border flex flex-col gap-1">
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
            path === "/settings"
              ? "bg-primary/10 text-primary font-medium"
              : "text-foreground/70 hover:bg-muted hover:text-foreground",
          )}
        >
          <Settings className="size-4" />
          <span>Settings</span>
        </Link>
        <div className="mt-2 rounded-lg bg-muted/60 p-3 flex items-center gap-3">
          <div className="size-8 rounded-full bg-primary grid place-items-center text-primary-foreground text-xs font-semibold">
            AS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground font-medium truncate">Aarav Sharma</p>
            <p className="text-xs text-muted-foreground truncate">Admin</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
