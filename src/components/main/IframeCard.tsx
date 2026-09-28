import { Trash2 } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import { Button } from "@/components/ui/button";

interface IframeCardProps {
  url: string;
  name: string;
  onDelete: () => void;
}

export function IframeCard({ url, name, onDelete }: IframeCardProps) {
  const { DialogFragment, openDialog, closeDialog } = useDialog({
    title: "Delete URL",
    description: `Are you sure you want to remove "${name}" from this group?`,
    children: (isOpen, close) => (
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={close}>Cancel</Button>
        <Button variant="destructive" onClick={() => { onDelete(); close(); }}>
          Delete
        </Button>
      </div>
    ),
  });

  return (
    <div className="flex flex-col bg-background rounded-lg border border-border shadow-sm overflow-hidden h-full relative">
      {DialogFragment}
      <div className="px-4 py-2 bg-muted/50 border-b border-border flex justify-between items-center">
        <div className="flex items-center gap-2 truncate max-w-[80%]">
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
          <span className="font-semibold text-foreground truncate">{name}</span>
          <span className="text-muted-foreground mx-1">-</span>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium hover:underline truncate text-muted-foreground"
          >
            {url}
          </a>
        </div>
        <button
          onClick={openDialog}
          className="text-muted-foreground hover:text-red-500 p-1.5 rounded hover:bg-background transition"
          title="Remove URL"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="flex-1 relative bg-muted/20">
        <iframe
          src={url}
          className="absolute inset-0 w-full h-full border-0"
          title={`Visualizer - ${name}`}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
}
