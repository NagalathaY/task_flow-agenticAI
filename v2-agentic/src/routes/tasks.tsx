import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Plus, Filter } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tasks as initialTasks, members, getMember, statusLabel, type Task, type TaskStatus } from "@/lib/club-data";

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
  head: () => ({ meta: [{ title: "Tasks · AI Club" }] }),
});

function TasksPage() {
  const [taskList, setTaskList] = useState<Task[]>(initialTasks);
  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");
  const [memberFilter, setMemberFilter] = useState<string>("all");
  const [assignOpen, setAssignOpen] = useState(false);

  // new task form state
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState<string>(members[0].id);
  const [deadline, setDeadline] = useState<string>(new Date().toISOString().slice(0, 10));

  const filtered = useMemo(
    () =>
      taskList.filter(
        (t) =>
          (statusFilter === "all" || t.status === statusFilter) &&
          (memberFilter === "all" || t.assigneeId === memberFilter),
      ),
    [taskList, statusFilter, memberFilter],
  );

  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTaskList((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const handleAssign = () => {
    if (!title.trim()) return;
    setTaskList((prev) => [
      {
        id: `t${Date.now()}`,
        title: title.trim(),
        assigneeId: assignee,
        deadline,
        status: "pending",
        priority: "medium",
      },
      ...prev,
    ]);
    setTitle("");
    setAssignOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto flex flex-col gap-5">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
              <Filter className="size-3.5" /> Filter
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="h-9 w-[150px] bg-card">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={memberFilter} onValueChange={setMemberFilter}>
              <SelectTrigger className="h-9 w-[180px] bg-card">
                <SelectValue placeholder="Member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All members</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setAssignOpen(true)}>
            <Plus className="size-4" /> Assign Task
          </Button>
        </div>

        {/* Task list */}
        <Card>
          <CardContent className="p-0">
            <div className="hidden md:grid grid-cols-[1fr_180px_140px_160px] gap-4 px-5 py-3 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <span>Task</span>
              <span>Assigned to</span>
              <span>Deadline</span>
              <span>Status</span>
            </div>
            <ul className="divide-y divide-border">
              {filtered.length === 0 && (
                <li className="p-8 text-center text-sm text-muted-foreground">No tasks match these filters.</li>
              )}
              {filtered.map((t) => {
                const m = getMember(t.assigneeId);
                const due = new Date(t.deadline);
                const overdue = due.getTime() < Date.now() && t.status !== "completed";
                return (
                  <li
                    key={t.id}
                    className="grid grid-cols-1 md:grid-cols-[1fr_180px_140px_160px] gap-2 md:gap-4 px-5 py-4 items-center hover:bg-muted/40 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{t.title}</p>
                      {t.priority === "high" && (
                        <span className="text-[10px] uppercase tracking-wider text-destructive font-medium">
                          High priority
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="size-7 rounded-full bg-primary/10 text-primary grid place-items-center text-[11px] font-semibold flex-shrink-0">
                        {m?.initials}
                      </div>
                      <span className="text-sm text-foreground truncate">{m?.name}</span>
                    </div>
                    <div className={`text-sm ${overdue ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                      {due.toLocaleDateString()}
                      {overdue && <span className="block text-[10px] uppercase">Overdue</span>}
                    </div>
                    <div>
                      <Select value={t.status} onValueChange={(v) => handleStatusChange(t.id, v as TaskStatus)}>
                        <SelectTrigger className="h-8 text-xs bg-card">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(statusLabel) as TaskStatus[]).map((s) => (
                            <SelectItem key={s} value={s}>
                              {statusLabel[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Assign dialog */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign a new task</DialogTitle>
            <DialogDescription>Create a task and assign it to a club member.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-foreground">Task title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Prepare workshop slides"
                className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-foreground">Assign to</span>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} — {m.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-foreground">Deadline</span>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign}>Assign Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
