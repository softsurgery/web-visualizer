import React from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { StorageService } from "@/services/StorageService";
import type { Group } from "@/types";

interface SettingsViewProps {
  groups: Group[];
  onImportGroups: (groups: Group[]) => void;
}

export function SettingsView({ groups, onImportGroups }: SettingsViewProps) {
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
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      <header className="px-6 py-4 border-b border-border flex items-center gap-2 bg-background">
        <SidebarTrigger className="-ml-4 mr-2" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your application settings</p>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl">
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Data Management</h3>
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
      </main>
    </div>
  );
}
