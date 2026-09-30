import React from "react";
import { Plus } from "lucide-react";
import type { Group } from "@/types";
import { useSheet } from "@/hooks/useSheet";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useVisualizer, useBreadcrumb } from "@/contexts";
import { BreadcrumbCommon } from "@/components/layout/BreadcrumbCommon";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../shared/mode-toggle";
import { useLocation } from "react-router-dom";

interface MainHeaderProps {
  className?: string;
  activeGroup?: Group;
  onAddUrl?: (url: string, name: string, pointToCenter?: boolean) => void;
}

export function MainHeader({
  className,
  activeGroup: activeGroupProp,
  onAddUrl: onAddUrlProp,
}: MainHeaderProps = {}) {
  const visualizer = useVisualizer();
  const activeGroup = activeGroupProp ?? visualizer.activeGroup;
  const onAddUrl = onAddUrlProp ?? visualizer.addUrl;
  const { routes } = useBreadcrumb();
  const location = useLocation();
  const [newUrl, setNewUrl] = React.useState("");
  const [newName, setNewName] = React.useState("");
  const [pointToCenter, setPointToCenter] = React.useState(false);

  const isSettings = location.pathname === "/settings";
  const isDetails = location.pathname.startsWith("/details");

  const { SheetFragment, openSheet, closeSheet } = useSheet({
    title: "Add New URL",
    description: activeGroup
      ? `Add a new URL to ${activeGroup.name}`
      : "Add a new URL",
    side: "right",
    children: (
      <form onSubmit={handleAddUrl} className="flex flex-col gap-4 mt-4">
        <input
          type="text"
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent bg-background text-foreground"
          autoFocus
        />
        <input
          type="text"
          placeholder="https://example.com"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent bg-background text-foreground"
        />
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={pointToCenter}
            onChange={(e) => setPointToCenter(e.target.checked)}
            className="rounded border-border text-foreground focus:ring-foreground"
          />
          Point to Center (Scroll vertically to center of iframe)
        </label>
        <Button
          type="submit"
          disabled={!newUrl.trim() || !newName.trim()}
          className="w-full"
        >
          Add URL
        </Button>
      </form>
    ),
  });

  function handleAddUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!newUrl.trim() || !newName.trim() || !onAddUrl) return;

    let urlToAdd = newUrl.trim();
    if (!urlToAdd.startsWith("http://") && !urlToAdd.startsWith("https://")) {
      urlToAdd = "https://" + urlToAdd;
    }

    onAddUrl(urlToAdd, newName.trim(), pointToCenter);
    setNewUrl("");
    setNewName("");
    setPointToCenter(false);
    closeSheet();
  }

  const getTitle = () => {
    if (isSettings) return "Settings";
    if (isDetails) return "Website Details";
    return activeGroup?.name || "Visualizer";
  };

  return (
    <header
      className={cn(
        "h-[var(--header-height,3.5rem)] shrink-0 px-4 md:px-6 border-b border-border flex items-center justify-between bg-background gap-4",
        className,
      )}
    >
      {SheetFragment}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <SidebarTrigger className="-ml-1 mr-2 shrink-0" />
        {routes && routes.length > 0 ? (
          <BreadcrumbCommon />
        ) : (
          <h2 className="text-lg font-bold text-foreground truncate">
            {getTitle()}
          </h2>
        )}
      </div>
      <div className="flex items-center gap-2">
        {!isSettings && !isDetails && activeGroup && (
          <Button onClick={openSheet} className="flex items-center gap-2">
            <Plus size={18} /> <span className="hidden sm:inline">Add URL</span>
          </Button>
        )}
        <ModeToggle />
      </div>
    </header>
  );
}
