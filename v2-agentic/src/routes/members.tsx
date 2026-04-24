import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { members, tasks } from "@/lib/club-data";

export const Route = createFileRoute("/members")({
  component: MembersPage,
  head: () => ({ meta: [{ title: "Members · AI Club" }] }),
});

function MembersPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => {
            const assigned = tasks.filter((t) => t.assigneeId === m.id);
            const completed = assigned.filter((t) => t.status === "completed").length;
            const rate = assigned.length ? Math.round((completed / assigned.length) * 100) : 0;
            return (
              <Card key={m.id}>
                <CardContent className="p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-full bg-primary/10 text-primary grid place-items-center font-semibold">
                      {m.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.role}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {m.skills.map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2 py-0.5 rounded-md bg-muted text-foreground border border-border"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <p className="text-xs text-muted-foreground">Tasks</p>
                      <p className="text-sm font-semibold text-foreground tabular-nums">
                        {completed}<span className="text-muted-foreground font-normal"> / {assigned.length}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Completion</p>
                      <p className="text-sm font-semibold text-foreground tabular-nums">{rate}%</p>
                    </div>
                  </div>

                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${rate}%` }} />
                  </div>

                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate({ to: "/tasks" })}>
                    <UserPlus className="size-3.5" /> Assign task
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
