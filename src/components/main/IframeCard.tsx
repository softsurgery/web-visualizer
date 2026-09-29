import { Trash2 } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import { Button } from "@/components/ui/button";
import React from "react";
import { DESKTOP_WIDTH } from "./constants";
import { cn } from "cn";

interface IframeCardProps {
  className?: string;
  url: string;
  name: string;
  onDelete: () => void;
}

export function IframeCard({
  className,
  url,
  name,
  onDelete,
}: IframeCardProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  const [useProxy, setUseProxy] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    setIsChecking(true);
    fetch(`/__check-frameable?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        setUseProxy(!data.frameable);
      })
      .catch(() => {
        setUseProxy(true); // Default to proxy on error
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, [url]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        // avoid dividing by zero or setting scale too high
        setScale(Math.max(0.1, width / DESKTOP_WIDTH));
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [isChecking]);

  const { DialogFragment, openDialog, closeDialog } = useDialog({
    title: "Delete URL",
    description: `Are you sure you want to remove "${name}" from this group?`,
    children: (isOpen, close) => (
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={close}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            onDelete();
            close();
          }}
        >
          Delete
        </Button>
      </div>
    ),
  });

  return (
    <div
      className={cn(
        "flex flex-col bg-background rounded-lg border border-border shadow-sm overflow-hidden h-full relative",
        className,
      )}
    >
      {DialogFragment}
      <div className="px-4 py-2 bg-muted/50 border-b border-border flex justify-between items-center z-10">
        <div className="flex items-center gap-2 truncate max-w-[80%]">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isChecking
                ? "bg-yellow-500"
                : useProxy
                  ? "bg-orange-500"
                  : "bg-green-500"
            }`}
            title={
              isChecking
                ? "Checking frameability..."
                : useProxy
                  ? "Proxied (Bypassing X-Frame-Options)"
                  : "Direct Connection"
            }
          ></span>
          <span className="text-xs font-semibold text-foreground truncate">
            {name}
          </span>
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
        <Button
          variant="ghost"
          size="icon"
          onClick={openDialog}
          className="text-muted-foreground hover:text-red-500 h-8 w-8 transition"
          title="Remove URL"
        >
          <Trash2 size={16} />
        </Button>
      </div>
      <div
        className="flex-1 relative bg-muted/20 overflow-hidden"
        ref={containerRef}
      >
        {!isChecking && (
          <iframe
            src={useProxy ? `/__proxy?url=${encodeURIComponent(url)}` : url}
            className="absolute top-0 left-0 border-0"
            style={{
              // Add 24px to width to push the vertical scrollbar out of view
              width: `${DESKTOP_WIDTH + 24}px`,
              // Add 24px to height to push the horizontal scrollbar out of view (if any)
              height: `calc(${100 / scale}% + 24px)`,
              transform: `scale(${scale})`,
              transformOrigin: "0 0",
            }}
            title={`Visualizer - ${name}`}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}
        {isChecking && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-muted-foreground animate-pulse">
              Checking connection...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
