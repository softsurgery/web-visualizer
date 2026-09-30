import { X, Edit2, GripVertical } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";
import { DESKTOP_WIDTH } from "./constants";
import { cn } from "cn";

interface IframeCardProps {
  className?: string;
  url: string;
  name: string;
  pointToCenter?: boolean;
  onDelete: () => void;
  onEdit: (url: string, name: string, pointToCenter: boolean) => void;
  dragHandleProps?: {
    attributes: any;
    listeners: any;
  };
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
  dragHandleProps,
}: IframeCardProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
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
    fetch(`/api/check-frameable?url=${encodeURIComponent(url)}`)
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
      
      if (pointToCenter && !isChecking && !useProxy) {
        setTimeout(() => {
          container.scrollTop =
            container.scrollHeight / 2 - container.clientHeight / 2;
        }, 10);
      }
    });

    observer.observe(container);

    if (pointToCenter && !isChecking && !useProxy) {
      setTimeout(() => {
        container.scrollTop =
          container.scrollHeight / 2 - container.clientHeight / 2;
      }, 100);
    }

    return () => observer.disconnect();
  }, [isChecking, pointToCenter, useProxy]);

  const { DialogFragment, openDialog } = useDialog({
    title: "Delete URL",
    description: `Are you sure you want to remove "${name}" from this group?`,
    children: (_isOpen, close) => (
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
      children: (_isOpen, close) => (
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
    router.push(
      `/details/${encodeURIComponent(url)}?name=${encodeURIComponent(name)}&isProxied=${useProxy}`,
    );
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
        <div className="flex flex-col gap-1 min-w-0 flex-1 pr-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={cn(
                "w-2 h-2 rounded-full shrink-0",
                isChecking
                  ? "bg-warning"
                  : useProxy
                    ? "bg-warning"
                    : "bg-success",
              )}
            ></div>
            <span className="text-xs font-semibold text-foreground truncate" title={name}>
              {name}
            </span>
          </div>

          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            title={url}
            className="text-sm font-medium hover:underline truncate text-muted-foreground block"
          >
            {url}
          </a>
        </div>
        <div className="flex gap-1 shrink-0 items-center">
          {dragHandleProps && (
            <div
              {...dragHandleProps.attributes}
              {...dragHandleProps.listeners}
              className="cursor-grab text-muted-foreground hover:text-foreground h-8 w-8 flex items-center justify-center transition"
              title="Drag to reorder"
            >
              <GripVertical size={16} />
            </div>
          )}
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
            className="text-muted-foreground hover:text-destructive h-8 w-8 transition"
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

            {useProxy ? (
              <div 
                className="absolute top-0 left-0 flex flex-col bg-white text-[#202124] pointer-events-none"
                style={{
                  width: `${DESKTOP_WIDTH}px`,
                  height: `4000px`,
                  transform: `scale(${scale})`,
                  transformOrigin: "0 0",
                  fontFamily: '"Segoe UI", Tahoma, sans-serif',
                  paddingTop: "120px",
                  paddingLeft: "15%",
                  paddingRight: "15%",
                }}
              >
                <div className="max-w-[600px] w-full">
                  <svg
                    className="w-12 h-12 text-[#5f6368] mb-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7zM6 20V4h6v6h6v10H6zm2.5-8.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM12 17c-2.33 0-4.32-1.45-5.12-3.5h1.67c.69 1.19 1.97 2 3.45 2s2.75-.81 3.45-2h1.67c-.8 2.05-2.79 3.5-5.12 3.5z" />
                  </svg>
                  <h1 className="text-2xl font-normal tracking-tight mb-4 text-[#202124]">
                    This site can't be reached
                  </h1>
                  <p className="text-[15px] mb-6 text-[#202124]">
                    <span className="font-bold">
                      {(() => {
                        try {
                          return new URL(url).hostname;
                        } catch (e) {
                          return url;
                        }
                      })()}
                    </span>{" "}
                    refused to connect.
                  </p>
                  <div className="text-[14px] text-[#5f6368]">
                    <p className="mb-4">Try:</p>
                    <ul className="list-disc pl-10 space-y-2 mb-8">
                      <li>Checking the connection</li>
                      <li>Checking the proxy and the firewall</li>
                      <li>Running Windows Network Diagnostics</li>
                    </ul>
                    <p className="text-[12px] text-[#5f6368] uppercase tracking-wider font-semibold">
                      ERR_CONNECTION_REFUSED
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                src={url}
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
            )}
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
