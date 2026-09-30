import React from "react";
import { Plus, X, ExternalLink, Menu } from "lucide-react";
import type { Group } from "../types";

interface MainViewProps {
  activeGroup?: Group;
  onAddUrl: (url: string) => void;
  onDeleteUrl: (index: number) => void;
}

export function MainView({
  activeGroup,
  onAddUrl,
  onDeleteUrl,
}: MainViewProps) {
  const [newUrl, setNewUrl] = React.useState("");

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    let urlToAdd = newUrl.trim();
    if (!urlToAdd.startsWith("http://") && !urlToAdd.startsWith("https://")) {
      urlToAdd = "https://" + urlToAdd;
    }

    onAddUrl(urlToAdd);
    setNewUrl("");
  };

  if (!activeGroup) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground h-full bg-background">
        <Menu size={48} className="mb-4 opacity-20" />
        <p className="text-lg">Select a group or create a new one.</p>
      </div>
    );
  }

  return (
    <>
      <header className="px-6 py-4 border-b border-border flex items-center justify-between md:pl-6 pl-16 bg-background">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{activeGroup.name}</h2>
          <p className="text-sm text-muted-foreground">
            {activeGroup.urls.length} URLs in this group
          </p>
        </div>
        <form onSubmit={handleAddUrl} className="flex gap-2 w-full max-w-md">
          <input
            type="text"
            placeholder="https://example.com"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="flex-1 px-4 py-2 border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newUrl.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 font-medium flex items-center gap-2 transition"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Add URL</span>
          </button>
        </form>
      </header>

      <div className="flex-1 p-6 overflow-y-auto bg-muted/10">
        {activeGroup.urls.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <ExternalLink size={48} className="mb-4 opacity-20" />
            <p className="text-lg">No URLs in this group.</p>
            <p className="text-sm mt-1">Add one using the input above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full auto-rows-[500px]">
            {activeGroup.urls.map((entry, index) => {
              const url = typeof entry === "string" ? entry : entry.url;
              const displayName = typeof entry === "string" ? entry : (entry.name || entry.url);
              return (
                <div
                  key={`${url}-${index}`}
                  className="flex flex-col bg-card text-card-foreground rounded-lg border border-border shadow-sm overflow-hidden h-full"
                >
                  <div className="px-4 py-2 bg-muted/50 border-b border-border flex justify-between items-center">
                    <div className="flex items-center gap-2 truncate max-w-[80%]">
                      <span className="w-2 h-2 rounded-full bg-success shrink-0"></span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium hover:underline truncate"
                      >
                        {displayName}
                      </a>
                    </div>
                    <button
                      onClick={() => onDeleteUrl(index)}
                      className="text-muted-foreground hover:text-destructive p-1.5 rounded hover:bg-muted transition"
                      title="Remove URL"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex-1 relative bg-muted/20">
                    <iframe
                      src={url}
                      className="absolute inset-0 w-full h-full border-0"
                      title={`Visualizer - ${displayName}`}
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
