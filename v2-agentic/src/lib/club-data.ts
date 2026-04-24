// Shared mock data for the AI Club Workflow Management System.
// Pure frontend data — no backend calls.

export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Member {
  id: string;
  name: string;
  role: string;
  initials: string;
  skills: string[];
  tasksAssigned: number;
  tasksCompleted: number;
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string;
  deadline: string; // ISO date
  status: TaskStatus;
  eventId?: string;
  priority: "low" | "medium" | "high";
}

export interface ClubEvent {
  id: string;
  name: string;
  date: string; // ISO date
  team: string[]; // member ids
  location: string;
  checklist: { id: string; label: string; done: boolean }[];
}

export interface Notification {
  id: string;
  type: "deadline" | "task" | "event";
  title: string;
  detail: string;
  time: string;
  unread: boolean;
}

export const members: Member[] = [
  {
    id: "m1",
    name: "Aarav Sharma",
    role: "President",
    initials: "AS",
    skills: ["Leadership", "Python", "ML"],
    tasksAssigned: 6,
    tasksCompleted: 5,
  },
  {
    id: "m2",
    name: "Priya Ramaswamy",
    role: "Design Lead",
    initials: "PR",
    skills: ["Figma", "UI/UX", "Branding"],
    tasksAssigned: 4,
    tasksCompleted: 3,
  },
  {
    id: "m3",
    name: "Caleb Voss",
    role: "Frontend Dev",
    initials: "CV",
    skills: ["React", "TypeScript", "Tailwind"],
    tasksAssigned: 5,
    tasksCompleted: 2,
  },
  {
    id: "m4",
    name: "Mei Tanaka",
    role: "ML Engineer",
    initials: "MT",
    skills: ["PyTorch", "NLP", "Research"],
    tasksAssigned: 3,
    tasksCompleted: 3,
  },
  {
    id: "m5",
    name: "Diego Alvarez",
    role: "Event Coordinator",
    initials: "DA",
    skills: ["Logistics", "Outreach", "Writing"],
    tasksAssigned: 4,
    tasksCompleted: 1,
  },
  {
    id: "m6",
    name: "Sana Khan",
    role: "Content Lead",
    initials: "SK",
    skills: ["Social Media", "Copywriting"],
    tasksAssigned: 3,
    tasksCompleted: 2,
  },
];

const iso = (d: Date) => d.toISOString().slice(0, 10);
const today = new Date();
const addDays = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return iso(d);
};

export const tasks: Task[] = [
  { id: "t1", title: "Design hackathon poster", assigneeId: "m2", deadline: addDays(2), status: "in_progress", eventId: "e1", priority: "high" },
  { id: "t2", title: "Book auditorium for workshop", assigneeId: "m5", deadline: addDays(4), status: "pending", eventId: "e2", priority: "high" },
  { id: "t3", title: "Prepare intro slides on LangChain", assigneeId: "m4", deadline: addDays(6), status: "pending", eventId: "e2", priority: "medium" },
  { id: "t4", title: "Build event registration page", assigneeId: "m3", deadline: addDays(3), status: "in_progress", eventId: "e1", priority: "high" },
  { id: "t5", title: "Write announcement post", assigneeId: "m6", deadline: addDays(1), status: "completed", eventId: "e1", priority: "medium" },
  { id: "t6", title: "Email sponsors for hackathon", assigneeId: "m1", deadline: addDays(5), status: "in_progress", eventId: "e1", priority: "high" },
  { id: "t7", title: "Review member applications", assigneeId: "m1", deadline: addDays(-1), status: "completed", priority: "low" },
  { id: "t8", title: "Order snacks & water", assigneeId: "m5", deadline: addDays(7), status: "pending", eventId: "e2", priority: "low" },
  { id: "t9", title: "Finalize judging rubric", assigneeId: "m4", deadline: addDays(8), status: "pending", eventId: "e1", priority: "medium" },
  { id: "t10", title: "Update club website homepage", assigneeId: "m3", deadline: addDays(10), status: "pending", priority: "low" },
];

export const events: ClubEvent[] = [
  {
    id: "e1",
    name: "Annual AI Hackathon",
    date: addDays(14),
    team: ["m1", "m2", "m3", "m5"],
    location: "Main Auditorium",
    checklist: [
      { id: "c1", label: "Design poster", done: false },
      { id: "c2", label: "Build registration page", done: false },
      { id: "c3", label: "Email sponsors", done: false },
      { id: "c4", label: "Publish announcement", done: true },
      { id: "c5", label: "Finalize judging rubric", done: false },
    ],
  },
  {
    id: "e2",
    name: "LangChain Workshop",
    date: addDays(9),
    team: ["m4", "m5"],
    location: "Lab 2",
    checklist: [
      { id: "c6", label: "Book venue", done: false },
      { id: "c7", label: "Prepare slides", done: false },
      { id: "c8", label: "Order refreshments", done: false },
    ],
  },
  {
    id: "e3",
    name: "New Member Orientation",
    date: addDays(21),
    team: ["m1", "m6"],
    location: "Commons Room",
    checklist: [
      { id: "c9", label: "Prepare welcome pack", done: false },
      { id: "c10", label: "Assign mentors", done: false },
    ],
  },
];

export const notifications: Notification[] = [
  { id: "n1", type: "deadline", title: "Deadline tomorrow: Design hackathon poster", detail: "Assigned to Priya Ramaswamy", time: "1h ago", unread: true },
  { id: "n2", type: "task", title: "Caleb Voss updated 'Build registration page' to In Progress", detail: "Event: Annual AI Hackathon", time: "3h ago", unread: true },
  { id: "n3", type: "event", title: "LangChain Workshop is in 9 days", detail: "3 checklist items still pending", time: "5h ago", unread: true },
  { id: "n4", type: "task", title: "Sana Khan completed 'Write announcement post'", detail: "Event: Annual AI Hackathon", time: "Yesterday", unread: false },
  { id: "n5", type: "deadline", title: "Overdue: Review member applications", detail: "Assigned to Aarav Sharma", time: "Yesterday", unread: false },
  { id: "n6", type: "event", title: "New Member Orientation scheduled", detail: "Commons Room · in 21 days", time: "2 days ago", unread: false },
];

export const getMember = (id: string) => members.find((m) => m.id === id);
export const statusLabel: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};
