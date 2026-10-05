import React from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { Group } from "@/types";
import { useVisualizer } from "@/hooks/useVisualizer";
import { useIntro } from "@/contexts/IntroContext";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useTabName } from "@/hooks/useTabName";

interface SettingsViewProps {
  groups?: Group[];
  onImportGroups?: (groups: Group[]) => void;
}

export function SettingsView({ groups: groupsProp, onImportGroups: onImportGroupsProp }: SettingsViewProps = {}) {
  const visualizer = useVisualizer();
  const groups = groupsProp ?? visualizer.groups;
  const onImportGroups = onImportGroupsProp ?? visualizer.importGroups;
  const { setIntro } = useIntro();
  const { setRoutes } = useBreadcrumb();
  
  useTabName("Settings");

  React.useEffect(() => {
    setIntro({
      title: "Settings",
      description: "Manage your application settings and configurations",
    });
    setRoutes?.([
      { title: "Groups", href: "/" },
      { title: "Settings", href: "/settings" },
    ]);
    return () => setIntro({});
  }, [setIntro, setRoutes]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      const res = await fetch("/api/groups?limit=1000");
      if (!res.ok) throw new Error("Failed to fetch groups from database");
      const data = await res.json();
      
      let exportData = data.docs;
      if (!exportData) exportData = [];

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "groups-export.json";
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed", e);
      alert("Failed to export database");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            const migrated = parsed.map((g: any) => ({
              ...g,
              urls: (g.urls || []).map((u: any) => 
                typeof u === 'string' ? { url: u, name: u } : u
              )
            }));
            
            const res = await fetch('/api/groups/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(migrated)
            });

            if (!res.ok) {
              const err = await res.json();
              throw new Error(err.error || "Database sync failed");
            }

            onImportGroups(migrated);
          } else {
            throw new Error("Invalid JSON format");
          }
        } catch (error: any) {
          alert(error.message || "Error parsing JSON file or syncing to database");
        }
      };
      reader.onerror = () => alert("Error reading file");
      reader.readAsText(file);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-2xl w-full">
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Data Management</h3>
        <div className="p-6 border border-border rounded-lg bg-card text-card-foreground">
          <h4 className="font-medium mb-2">Import / Export</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Backup your groups and URLs, or import an existing configuration.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleExport} className="flex gap-2">
              <Download size={16} /> Export JSON
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} className="flex gap-2">
              <Upload size={16} /> Import JSON
            </Button>
            <input
              type="file"
              accept=".json"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImport}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default SettingsView;
