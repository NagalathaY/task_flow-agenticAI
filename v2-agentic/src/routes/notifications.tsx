import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlarmClock, ListChecks, CalendarDays, CheckCheck } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notifications as initialNotifications, type Notification } from "@/lib/club-data";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
  head: () => ({ meta: [{ title: "Notifications · AI Club" }] }),
});

const iconMap = {
  deadline: AlarmClock,
  task: ListChecks,
  event: CalendarDays,
} as const;

const colorMap = {
  deadline: "text-amber-600 bg-amber-500/10",
  task: "text-primary bg-primary/10",
  event: "text-emerald-600 bg-emerald-500/10",
} as const;

function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | Notification["type"]>("all");

  const filtered = items.filter((n) => filter === "all" || n.type === filter);
  const unread = items.filter((n) => n.unread).length;

  const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  const toggleRead = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  const tabs: { key: "all" | Notification["type"]; label: string }[] = [
    { key: "all", label: "All" },
    { key: "deadline", label: "Deadlines" },
    { key: "task", label: "Task updates" },
    { key: "event", label: "Event alerts" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto flex flex-col gap-5">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">
              {unread > 0 ? `${unread} unread` : "All caught up"}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={markAll} disabled={unread === 0}>
              <CheckCheck className="size-3.5" /> Mark all read
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1 mb-4 border-b border-border">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setFilter(t.key)}
                  className={`px-3 py-2 text-sm -mb-px border-b-2 transition-colors ${
                    filter === t.key
                      ? "border-primary text-foreground font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <ul className="flex flex-col gap-2">
              {filtered.length === 0 && (
                <li className="text-sm text-muted-foreground text-center py-8">Nothing here.</li>
              )}
              {filtered.map((n) => {
                const Icon = iconMap[n.type];
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => toggleRead(n.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${
                        n.unread ? "border-primary/30 bg-primary/5" : "border-border bg-card hover:bg-muted/40"
                      }`}
                    >
                      <div className={`size-9 rounded-full grid place-items-center flex-shrink-0 ${colorMap[n.type]}`}>
                        <Icon className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.detail}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">{n.time}</p>
                      </div>
                      {n.unread && <span className="size-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
