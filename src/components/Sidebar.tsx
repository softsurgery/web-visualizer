import React from "react";
import { Plus, Download, Upload, X } from "lucide-react";
import type { Group } from "../types";

interface SidebarProps {
  groups: Group[];
  activeGroupId: string | null;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onAddGroup: (name: string) => void;
  onDeleteGroup: (id: string, e: React.MouseEvent) => void;
  onSetActiveGroup: (id: string) => void;
  onImportGroups: (groups: Group[]) => void;
}

export function Sidebar({
  groups,
  activeGroupId,
  isSidebarOpen,
  setIsSidebarOpen,
  onAddGroup,
  onDeleteGroup,
  onSetActiveGroup,
  onImportGroups,
}: SidebarProps) {
  const [newGroupName, setNewGroupName] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    onAddGroup(newGroupName);
    setNewGroupName("");
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(groups, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "groups-export.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportGroups(parsed);
        } else {
          alert("Invalid JSON format");
        }
      } catch (error) {
        alert("Error parsing JSON file");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <aside
      className={`${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } absolute md:relative z-40 w-72 h-full bg-gray-50 border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out`}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <h1 className="font-bold text-xl tracking-tight">Visualizer</h1>
        <button
          className="md:hidden p-1 hover:bg-gray-100 rounded"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition"
          >
            <Download size={16} /> Export
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-black text-white rounded hover:bg-gray-800 transition"
          >
            <Upload size={16} /> Import
          </button>
          <input
            type="file"
            accept=".json"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImport}
          />
        </div>

        <form onSubmit={handleAddGroup} className="flex gap-2">
          <input
            type="text"
            placeholder="New Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newGroupName.trim()}
            className="px-3 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 transition"
          >
            <Plus size={18} />
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto">
        {groups.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No groups yet. Create one above!
          </div>
        ) : (
          <ul className="py-2">
            {groups.map((group) => (
              <li key={group.id}>
                <button
                  onClick={() => onSetActiveGroup(group.id)}
                  className={`w-full text-left px-4 py-3 flex justify-between items-center group transition ${
                    activeGroupId === group.id
                      ? "bg-gray-200 font-medium"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <span className="truncate pr-4">{group.name}</span>
                  <span
                    onClick={(e) => onDeleteGroup(group.id, e)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1"
                    title="Delete group"
                  >
                    <X size={16} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
