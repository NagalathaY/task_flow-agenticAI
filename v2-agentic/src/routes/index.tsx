import { createFileRoute, Link } from "@tanstack/react-router";
import { ListChecks, CheckCircle2, CalendarDays, Users, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { tasks, events, members, getMember, statusLabel } from "@/lib/club-data";

export const Route = createFileRoute("/")({
  component: AdminDashboard,
  head: () => ({
    meta: [
      { title: "Dashboard · AI Club Workflow Manager" },
      { name: "description", content: "Overview of tasks, events and member activity for the AI Club." },
    ],
  }),
});

function AdminDashboard() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const upcoming = [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  const completionRate = Math.round((completed / total) * 100);

  // Simple bar chart data: tasks per member
  const byMember = members
    .map((m) => ({ name: m.name.split(" ")[0], count: tasks.filter((t) => t.assigneeId === m.id).length }))
    .sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...byMember.map((b) => b.count), 1);

  const statusBreakdown = [
    { label: "Completed", value: completed, color: "bg-emerald-500" },
    { label: "In Progress", value: inProgress, color: "bg-primary" },
    { label: "Pending", value: pending, color: "bg-amber-500" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={ListChecks} label="Total Tasks" value={String(total)} hint={`${pending} pending`} />
          <StatCard icon={CheckCircle2} label="Completed" value={String(completed)} hint={`${completionRate}% completion rate`} />
          <StatCard icon={CalendarDays} label="Upcoming Events" value={String(events.length)} hint={`Next: ${upcoming[0]?.name ?? "—"}`} />
          <StatCard icon={Users} label="Active Members" value={String(members.length)} hint="All roles filled" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task status chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Task Status</CardTitle>
              <Button asChild size="sm" variant="outline">
                <Link to="/tasks">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Stacked bar */}
              <div>
                <div className="flex h-3 w-full rounded-full overflow-hidden bg-muted">
                  {statusBreakdown.map((s) => (
                    <div
                      key={s.label}
                      className={s.color}
                      style={{ width: `${(s.value / total) * 100}%` }}
                      title={`${s.label}: ${s.value}`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 mt-3">
                  {statusBreakdown.map((s) => (
                    <div key={s.label} className="flex items-center gap-2 text-xs">
                      <span className={`size-2.5 rounded-sm ${s.color}`} />
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="text-foreground font-medium tabular-nums">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks per member */}
              <div>
                <h3 className="text-xs text-muted-foreground mb-3">Tasks per member</h3>
                <div className="flex flex-col gap-2">
                  {byMember.map((b) => (
                    <div key={b.name} className="flex items-center gap-3">
                      <span className="text-xs text-foreground w-16 truncate">{b.name}</span>
                      <div className="flex-1 h-5 bg-muted rounded">
                        <div
                          className="h-full bg-primary rounded transition-all"
                          style={{ width: `${(b.count / maxCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground tabular-nums w-6 text-right">{b.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Upcoming Events</CardTitle>
              <Button asChild size="sm" variant="ghost" className="h-8">
                <Link to="/events">
                  <Plus className="size-3.5" /> New
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {upcoming.map((e) => {
                const d = new Date(e.date);
                return (
                  <Link
                    key={e.id}
                    to="/events"
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/60 transition-colors"
                  >
                    <div className="size-11 rounded-md bg-primary/10 text-primary grid place-items-center flex-shrink-0">
                      <div className="text-center leading-tight">
                        <div className="text-[9px] uppercase font-medium">
                          {d.toLocaleString("en", { month: "short" })}
                        </div>
                        <div className="text-sm font-semibold">{d.getDate()}</div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{e.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {e.location} · {e.team.length} members
                      </p>
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Recent tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col divide-y divide-border">
              {tasks.slice(0, 5).map((t) => {
                const m = getMember(t.assigneeId);
                return (
                  <div key={t.id} className="py-3 flex items-center gap-3">
                    <div className="size-8 rounded-full bg-muted grid place-items-center text-xs font-medium text-foreground">
                      {m?.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{t.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {m?.name} · due {new Date(t.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof ListChecks;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">{label}</span>
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-semibold text-foreground tabular-nums">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{hint}</p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: keyof typeof statusLabel }) {
  const styles = {
    pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    in_progress: "bg-primary/15 text-primary border-primary/30",
    completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  }[status];
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${styles}`}>
      {statusLabel[status]}
    </span>
  );
}
