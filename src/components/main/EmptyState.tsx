import { Menu, ExternalLink } from "lucide-react";

export function EmptyGroupState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground h-full bg-background">
      <Menu size={48} className="mb-4 opacity-20" />
      <p className="text-lg">Select a group or create a new one.</p>
    </div>
  );
}

export function EmptyUrlsState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/10">
      <ExternalLink size={48} className="mb-4 opacity-20" />
      <p className="text-lg">No URLs in this group.</p>
      <p className="text-sm mt-1">Add one using the input above.</p>
    </div>
  );
}
