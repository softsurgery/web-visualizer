import { Menu, ExternalLink } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  className?: string;
  onAddAction?: () => void;
}

export function EmptyGroupState({ className, onAddAction }: EmptyStateProps = {}) {
  return (
    <div
      className={cn(
        "flex-1 flex flex-col items-center justify-center text-muted-foreground h-full bg-background",
        className,
      )}
    >
      <Menu size={48} className="mb-4 opacity-20" />
      <p className="text-lg">
        Click the '+' button in the sidebar to create a new group.
      </p>
    </div>
  );
}

export function EmptyUrlsState({ className, onAddAction }: EmptyStateProps = {}) {
  return (
    <div
      className={cn(
        "h-full flex-1 flex flex-col items-center justify-center text-muted-foreground w-full",
        className,
      )}
    >
      <ExternalLink size={48} className="mb-4 opacity-20" />
      <p className="text-sm">No URLs in this group.</p>
      <Button variant="ghost" className="mt-4" onClick={onAddAction}>
        Add URL
      </Button>
    </div>
  );
}
