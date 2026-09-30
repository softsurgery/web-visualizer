import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { Group } from "@/types";
import { useVisualizer } from "@/hooks/useVisualizer";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { BreadcrumbCommon } from "@/components/layout/BreadcrumbCommon";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../shared/mode-toggle";
import { usePathname } from "next/navigation";

interface MainHeaderProps {
  className?: string;
  activeGroup?: Group;
  onAddUrl?: (url: string, name: string, pointToCenter?: boolean) => void;
}

export function MainHeader({
  className,
  activeGroup: activeGroupProp,
}: MainHeaderProps = {}) {
  const visualizer = useVisualizer();
  const activeGroup = activeGroupProp ?? visualizer.activeGroup;
  const { routes } = useBreadcrumb();
  const pathname = usePathname();
  const isSettings = pathname === "/settings";
  const isDetails = pathname?.startsWith("/details");

  const getTitle = () => {
    if (isSettings) return "Settings";
    if (isDetails) return "Website Details";
    return activeGroup?.name || "Visualizer";
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-(--header-height,3.5rem) shrink-0 px-4 md:px-6 border-b border-border flex items-center justify-between bg-background gap-4",
        className,
      )}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <SidebarTrigger className="-ml-1 mr-2 shrink-0" />
        {routes && routes.length > 0 ? (
          <BreadcrumbCommon />
        ) : (
          <h2
            className="text-lg font-bold text-foreground truncate"
            title={getTitle()}
          >
            {getTitle()}
          </h2>
        )}
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
      </div>
    </header>
  );
}
