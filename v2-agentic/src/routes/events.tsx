import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, MapPin, Users as UsersIcon, CheckCircle2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { events as initialEvents, members, getMember, type ClubEvent } from "@/lib/club-data";

export const Route = createFileRoute("/events")({
  component: EventsPage,
  head: () => ({ meta: [{ title: "Events · AI Club" }] }),
});

function EventsPage() {
  const [events, setEvents] = useState<ClubEvent[]>(initialEvents);
  const [selectedId, setSelectedId] = useState<string>(events[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState("");

  const selected = events.find((e) => e.id === selectedId);

  const handleToggle = (eventId: string, itemId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, checklist: e.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c)) }
          : e,
      ),
    );
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    const id = `e${Date.now()}`;
    // Auto-generate a starter checklist
    const checklist = [
      { id: `${id}-1`, label: "Book venue", done: false },
      { id: `${id}-2`, label: "Announce to members", done: false },
      { id: `${id}-3`, label: "Prepare materials", done: false },
      { id: `${id}-4`, label: "Post-event recap", done: false },
    ];
    const newEvent: ClubEvent = {
      id,
      name: name.trim(),
      date,
      location: location.trim() || "TBD",
      team: [],
      checklist,
    };
    setEvents((p) => [newEvent, ...p]);
    setSelectedId(id);
    setName("");
    setLocation("");
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto flex flex-col gap-5">
        <div className="flex items-center justify-end">
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Create Event
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Event list */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">All Events</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {events.map((e) => {
                  const d = new Date(e.date);
                  const active = e.id === selectedId;
                  const done = e.checklist.filter((c) => c.done).length;
                  return (
                    <li key={e.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(e.id)}
                        className={`w-full text-left px-5 py-4 flex items-center gap-3 transition-colors ${
                          active ? "bg-primary/5 border-l-2 border-primary" : "hover:bg-muted/50 border-l-2 border-transparent"
                        }`}
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
                          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                            <MapPin className="size-3" /> {e.location}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {done}/{e.checklist.length}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          {/* Event detail */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {selected ? (
              <>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">{selected.name}</h2>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{new Date(selected.date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</span>
                          <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {selected.location}</span>
                          <span className="flex items-center gap-1"><UsersIcon className="size-3.5" /> {selected.team.length} members</span>
                        </div>
                      </div>
                    </div>

                    {/* Team */}
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-2">Assigned team</p>
                      <div className="flex flex-wrap gap-2">
                        {selected.team.length === 0 && (
                          <span className="text-xs text-muted-foreground italic">No team assigned yet</span>
                        )}
                        {selected.team.map((id) => {
                          const m = getMember(id);
                          return (
                            <span
                              key={id}
                              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-muted text-xs text-foreground"
                            >
                              <span className="size-5 rounded-full bg-primary/15 text-primary grid place-items-center text-[10px] font-semibold">
                                {m?.initials}
                              </span>
                              {m?.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary" /> Task Checklist
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="flex flex-col gap-1">
                      {selected.checklist.map((c) => (
                        <li key={c.id}>
                          <label className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/60 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={c.done}
                              onChange={() => handleToggle(selected.id, c.id)}
                              className="size-4 accent-primary"
                            />
                            <span className={`text-sm ${c.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                              {c.label}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${
                            (selected.checklist.filter((c) => c.done).length / selected.checklist.length) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  Select an event to view details.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Create dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new event</DialogTitle>
            <DialogDescription>A starter task checklist will be auto-generated.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-foreground">Event name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Intro to Transformers Talk"
                className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-foreground">Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-foreground">Location</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Lab 2"
                className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
