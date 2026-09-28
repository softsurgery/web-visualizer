import React from "react";
import type { Group } from "@/types";
import { MainHeader } from "@/components/main/MainHeader";
import { IframeCard } from "@/components/main/IframeCard";
import { EmptyGroupState, EmptyUrlsState } from "@/components/main/EmptyState";
import { LayoutGrid, Grid3X3, Grid2X2, List } from "lucide-react";

type LayoutType = "lg" | "md" | "sm" | "list";

interface MainViewProps {
  activeGroup?: Group;
  onAddUrl: (url: string, name: string) => void;
  onDeleteUrl: (index: number) => void;
}

export function MainView({
  activeGroup,
  onAddUrl,
  onDeleteUrl,
}: MainViewProps) {
  const [layout, setLayout] = React.useState<LayoutType>("md");

  if (!activeGroup) {
    return <EmptyGroupState />;
  }

  const getGridClass = () => {
    switch (layout) {
      case "sm":
        return "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[300px]";
      case "md":
        return "grid grid-cols-1 xl:grid-cols-2 gap-6 auto-rows-[500px]";
      case "lg":
        return "grid grid-cols-1 gap-6 auto-rows-[700px]";
      case "list":
        return "flex flex-col gap-6";
      default:
        return "grid grid-cols-1 xl:grid-cols-2 gap-6 auto-rows-[500px]";
    }
  };

  return (
    <>
      <MainHeader activeGroup={activeGroup} onAddUrl={onAddUrl} />

      <div className="flex-1 p-6 overflow-y-auto bg-muted/10 flex flex-col">
        {activeGroup.urls.length === 0 ? (
          <EmptyUrlsState />
        ) : (
          <>
            <div className="flex justify-end mb-4 gap-1">
              <button
                onClick={() => setLayout("sm")}
                className={`p-2 rounded ${layout === "sm" ? "bg-foreground text-background" : "bg-background text-foreground border border-border hover:bg-muted"}`}
                title="Small Grid"
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setLayout("md")}
                className={`p-2 rounded ${layout === "md" ? "bg-foreground text-background" : "bg-background text-foreground border border-border hover:bg-muted"}`}
                title="Medium Grid"
              >
                <Grid2X2 size={18} />
              </button>
              <button
                onClick={() => setLayout("lg")}
                className={`p-2 rounded ${layout === "lg" ? "bg-foreground text-background" : "bg-background text-foreground border border-border hover:bg-muted"}`}
                title="Large Grid"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setLayout("list")}
                className={`p-2 rounded ${layout === "list" ? "bg-foreground text-background" : "bg-background text-foreground border border-border hover:bg-muted"}`}
                title="List View"
              >
                <List size={18} />
              </button>
            </div>
            <div className={getGridClass()}>
              {activeGroup.urls.map((entry, index) => (
                <div key={`${entry.url}-${index}`} className={layout === "list" ? "h-[500px]" : "h-full"}>
                  <IframeCard
                    url={entry.url}
                    name={entry.name}
                    onDelete={() => onDeleteUrl(index)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
