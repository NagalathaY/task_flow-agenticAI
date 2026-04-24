import { Link, useLocation } from "@tanstack/react-router";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notifications } from "@/lib/club-data";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Overview of your club's activity" },
  "/tasks": { title: "Tasks", subtitle: "Assign and track work across the club" },
  "/events": { title: "Events", subtitle: "Plan events and their task checklists" },
  "/members": { title: "Members", subtitle: "Club members, skills, and workload" },
  "/notifications": { title: "Notifications", subtitle: "Deadline reminders and updates" },
  "/settings": { title: "Settings", subtitle: "Manage your club information and preferences" },
};

export function TopBar() {
  const location = useLocation();
  const meta = titles[location.pathname] ?? { title: "AI Club", subtitle: "Workflow manager" };
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-5 md:px-8 gap-4 bg-background sticky top-0 z-20">
      <div className="min-w-0">
        <h1 className="text-base font-semibold text-foreground truncate">{meta.title}</h1>
        <p className="text-xs text-muted-foreground truncate">{meta.subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden sm:block relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search…"
            className="w-56 bg-muted/60 border border-border rounded-md pl-9 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-colors"
          />
        </div>
        <Button asChild variant="ghost" size="icon" className="relative">
          <Link to="/notifications" aria-label="Notifications">
            <Bell className="size-4" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
            )}
          </Link>
        </Button>
      </div>
    </header>
  );
}
