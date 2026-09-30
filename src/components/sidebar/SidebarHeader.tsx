import { Globe } from "lucide-react";
import { cn } from "cn";

interface SidebarHeaderProps {
  className?: string;
}

export function SidebarHeader({ className }: SidebarHeaderProps = {}) {
  return (
    <div className={cn("p-2 flex items-center justify-between", className)}>
      <div className="flex items-center gap-2 py-1.5">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Globe className="size-4" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-semibold text-sm text-sidebar-foreground">
            Visualizer
          </span>
        </div>
      </div>
    </div>
  );
}
