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
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 h-full">
        <Menu size={48} className="mb-4 opacity-20" />
        <p className="text-lg">Select a group or create a new one.</p>
      </div>
    );
  }

  return (
    <>
      <header className="px-6 py-4 border-b border-gray-200 flex items-center justify-between md:pl-6 pl-16 bg-white">
        <div>
          <h2 className="text-2xl font-bold">{activeGroup.name}</h2>
          <p className="text-sm text-gray-500">
            {activeGroup.urls.length} URLs in this group
          </p>
        </div>
        <form onSubmit={handleAddUrl} className="flex gap-2 w-full max-w-md">
          <input
            type="text"
            placeholder="https://example.com"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newUrl.trim()}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 font-medium flex items-center gap-2 transition"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Add URL</span>
          </button>
        </form>
      </header>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {activeGroup.urls.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <ExternalLink size={48} className="mb-4 opacity-20" />
            <p className="text-lg">No URLs in this group.</p>
            <p className="text-sm mt-1">Add one using the input above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full auto-rows-[500px]">
            {activeGroup.urls.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-full"
              >
                <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-2 truncate max-w-[80%]">
                    <span className="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium hover:underline truncate"
                    >
                      {url}
                    </a>
                  </div>
                  <button
                    onClick={() => onDeleteUrl(index)}
                    className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-white transition"
                    title="Remove URL"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex-1 relative bg-gray-50">
                  <iframe
                    src={url}
                    className="absolute inset-0 w-full h-full border-0"
                    title={`Visualizer - ${url}`}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
