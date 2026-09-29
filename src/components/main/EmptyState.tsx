import { Menu, ExternalLink } from "lucide-react";
import { cn } from "cn";

interface EmptyStateProps {
  className?: string;
}

export function EmptyGroupState({ className }: EmptyStateProps = {}) {
  return (
    <div className={cn("flex-1 flex flex-col items-center justify-center text-muted-foreground h-full bg-background", className)}>
      <Menu size={48} className="mb-4 opacity-20" />
      <p className="text-lg">Select a group or create a new one.</p>
    </div>
  );
}

export function EmptyUrlsState({ className }: EmptyStateProps = {}) {
  return (
    <div className={cn("h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/10", className)}>
      <ExternalLink size={48} className="mb-4 opacity-20" />
      <p className="text-lg">No URLs in this group.</p>
      <p className="text-sm mt-1">Add one using the input above.</p>
    </div>
  );
}
