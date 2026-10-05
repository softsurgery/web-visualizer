import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateUrlSheet } from "../modals/useCreateURLSheet";

interface AddUrlCardProps {
  className?: string;
  groupName?: string;
  onAddUrl: (url: string, name: string, pointToCenter?: boolean) => void;
}
export function AddUrlCard({
  className,
  groupName,
  onAddUrl,
}: AddUrlCardProps) {
  const { SheetFragment, openSheet } = useCreateUrlSheet({
    groupName,
    onAddUrl,
  });

  return (
    <div
      onClick={openSheet}
      className={cn(
        "flex flex-col items-center justify-center bg-background rounded-lg border-2 border-dashed border-border shadow-sm hover:border-foreground/50 hover:bg-muted/50 cursor-pointer transition-all h-full relative group min-h-50",
        className,
      )}
    >
      {SheetFragment}
      <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-foreground">
        <Plus size={50} />
      </div>
    </div>
  );
}
