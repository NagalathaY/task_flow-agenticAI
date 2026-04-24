import { ReactNode } from "react";
import { AgentSidebar } from "./AgentSidebar";
import { TopBar } from "./TopBar";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <AgentSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-muted/30">{children}</main>
      </div>
    </div>
  );
}
