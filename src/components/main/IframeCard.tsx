import { X, Edit2 } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";
import { DESKTOP_WIDTH } from "./constants";
import { cn } from "cn";

interface IframeCardProps {
  className?: string;
  url: string;
  name: string;
  pointToCenter?: boolean;
  onDelete: () => void;
  onEdit: (url: string, name: string, pointToCenter: boolean) => void;
}

export interface WebsiteData {
  url: string;
  name: string;
  isProxied: boolean;
}

export function IframeCard({
  className,
  url,
  name,
  pointToCenter,
  onDelete,
  onEdit,
}: IframeCardProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [scale, setScale] = React.useState(1);
  const [useProxy, setUseProxy] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(true);

  const [editUrl, setEditUrl] = React.useState(url);
  const [editName, setEditName] = React.useState(name);
  const [editPointToCenter, setEditPointToCenter] = React.useState(
    pointToCenter || false,
  );

  React.useEffect(() => {
    setEditUrl(url);
    setEditName(name);
    setEditPointToCenter(pointToCenter || false);
  }, [url, name, pointToCenter]);

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

    if (pointToCenter && !isChecking) {
      setTimeout(() => {
        container.scrollTop =
          container.scrollHeight / 2 - container.clientHeight / 2;
      }, 100);
    }

    return () => observer.disconnect();
  }, [isChecking, pointToCenter]);

  const { DialogFragment, openDialog } = useDialog({
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

  const { DialogFragment: EditDialogFragment, openDialog: openEditDialog } =
    useDialog({
      title: "Edit URL",
      description: "Update the details for this URL.",
      children: (isOpen, close) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onEdit(editUrl, editName, editPointToCenter);
            close();
          }}
          className="flex flex-col gap-4 mt-4"
        >
          <input
            type="text"
            placeholder="Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent bg-background text-foreground"
            autoFocus
          />
          <input
            type="text"
            placeholder="https://example.com"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent bg-background text-foreground"
          />
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={editPointToCenter}
              onChange={(e) => setEditPointToCenter(e.target.checked)}
              className="rounded border-border text-foreground focus:ring-foreground"
            />
            Point to Center
          </label>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      ),
    });

  const handleCardClick = () => {
    const data: WebsiteData = {
      url,
      name,
      isProxied: useProxy,
    };
    navigate(`/details/${encodeURIComponent(url)}`, { state: data });
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-background rounded-lg border border-border shadow-sm overflow-hidden h-full relative",
        className,
      )}
    >
      {DialogFragment}
      {EditDialogFragment}
      <div className="px-4 py-2 bg-muted/50 border-b border-border flex justify-between items-center z-20 relative">
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
        <div className="flex gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              openEditDialog();
            }}
            className="text-muted-foreground hover:text-foreground h-8 w-8 transition"
            title="Edit URL"
          >
            <Edit2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              openDialog();
            }}
            className="text-muted-foreground hover:text-red-500 h-8 w-8 transition"
            title="Remove URL"
          >
            <X size={16} />
          </Button>
        </div>
      </div>
      <div
        className="flex-1 relative bg-muted/20 overflow-y-auto overflow-x-hidden no-scrollbar"
        ref={containerRef}
      >
        {!isChecking && (
          <div
            className="relative w-full cursor-pointer"
            style={{ height: 4000 * scale }}
            onClick={handleCardClick}
          >
            {/* Invisible overlay to ensure clicks are caught regardless of iframe pointer-events behavior */}
            <div className="absolute inset-0 z-10" />

            <iframe
              src={useProxy ? `/__proxy?url=${encodeURIComponent(url)}` : url}
              className="absolute top-0 left-0 border-0 pointer-events-none"
              style={{
                width: `${DESKTOP_WIDTH}px`,
                height: `4000px`,
                transform: `scale(${scale})`,
                transformOrigin: "0 0",
              }}
              title={`Visualizer - ${name}`}
              scrolling="no"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
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
