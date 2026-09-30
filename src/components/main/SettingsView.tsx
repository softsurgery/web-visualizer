import React from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StorageService } from "@/services/StorageService";
import type { Group } from "@/types";
import { useVisualizer, useIntro, useBreadcrumb } from "@/contexts";

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

  const handleExport = () => {
    StorageService.exportGroups(groups);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedGroups = await StorageService.importGroups(file);
      onImportGroups(importedGroups);
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
