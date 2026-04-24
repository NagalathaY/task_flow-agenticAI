import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings · AI Club Workflow Manager" },
      { name: "description", content: "Manage your account and club settings." },
    ],
  }),
});

interface Settings {
  clubName: string;
  adminEmail: string;
  adminName: string;
  adminRole: string;
}

const DEFAULT_SETTINGS: Settings = {
  clubName: "AI Club",
  adminEmail: "aarav@aiclub.com",
  adminName: "Aarav Sharma",
  adminRole: "Admin",
};

const STORAGE_KEY = "club_settings";

function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
      }
    } catch (error) {
      console.error("Error loading settings from localStorage:", error);
    }
    setMounted(true);
  }, []);

  const handleInputChange = (field: keyof Settings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    try {
      console.log("Save button clicked", settings);

      // Validate required fields
      if (!settings.clubName || !settings.adminEmail || !settings.adminName || !settings.adminRole) {
        console.error("Validation failed - missing fields");
        toast.error("All fields are required");
        return;
      }

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      console.log("Settings saved to localStorage:", settings);
      toast.success("✅ Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(`Error saving settings: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleLoadSettings = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
        toast.success("✅ Settings loaded from storage!");
      } else {
        toast.info("ℹ No saved settings found. Using defaults.");
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error(`Error loading settings: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("🔄 Settings reset to defaults!");
  };

  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Loading settings...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Club Settings</CardTitle>
            <CardDescription>Manage your club information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="clubName">Club Name</Label>
              <Input
                id="clubName"
                type="text"
                value={settings.clubName}
                onChange={(e) => handleInputChange("clubName", e.target.value)}
                placeholder="Enter club name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminName">Admin Name</Label>
              <Input
                id="adminName"
                type="text"
                value={settings.adminName}
                onChange={(e) => handleInputChange("adminName", e.target.value)}
                placeholder="Enter admin name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                placeholder="Enter admin email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminRole">Admin Role</Label>
              <Input
                id="adminRole"
                type="text"
                value={settings.adminRole}
                onChange={(e) => handleInputChange("adminRole", e.target.value)}
                placeholder="Enter admin role"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} variant="default">
                💾 Save Settings
              </Button>
              <Button onClick={handleLoadSettings} variant="outline">
                📥 Load Settings
              </Button>
              <Button onClick={handleReset} variant="ghost">
                🔄 Reset to Defaults
              </Button>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> Settings are saved locally in your browser. To sync across devices, connect a database backend.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
