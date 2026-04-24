import { createFileRoute } from "@tanstack/react-router";

interface Settings {
  clubName: string;
  adminEmail: string;
  adminName: string;
  adminRole: string;
}

// Simple in-memory storage (in production, this would be a database)
let savedSettings: Settings = {
  clubName: "AI Club",
  adminEmail: "aarav@aiclub.com",
  adminName: "Aarav Sharma",
  adminRole: "Admin",
};

export const Route = createFileRoute("/api/settings")({
  beforeLoad: async ({ context }) => {
    return context;
  },
});

export async function GET() {
  return new Response(JSON.stringify(savedSettings), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request }: { request: Request }) {
  try {
    const body = (await request.json()) as Settings;

    // Validate required fields
    if (!body.clubName || !body.adminEmail || !body.adminName || !body.adminRole) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Save settings
    savedSettings = body;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Settings saved successfully",
        data: savedSettings,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: `Failed to save settings: ${error instanceof Error ? error.message : "Unknown error"}`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
