import React from "react";
import type { Group, LayoutType } from "@/types";
import { MainHeader } from "@/components/main/MainHeader";
import { IframeCard } from "@/components/main/IframeCard";
import { EmptyGroupState, EmptyUrlsState } from "@/components/main/EmptyState";
import { LayoutGrid, Grid3X3, Grid2X2, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

interface MainViewProps {
  className?: string;
  activeGroup?: Group;
  onAddUrl: (url: string, name: string, pointToCenter?: boolean) => void;
  onEditUrl: (index: number, url: string, name: string, pointToCenter?: boolean) => void;
  onDeleteUrl: (index: number) => void;
  onChangeLayout?: (id: string, layout: LayoutType) => void;
}

export function MainView({
  className,
  activeGroup,
  onAddUrl,
  onEditUrl,
  onDeleteUrl,
  onChangeLayout,
}: MainViewProps) {
  const [layout, setLayout] = React.useState<LayoutType>("md");

  React.useEffect(() => {
    if (activeGroup?.layout) {
      setLayout(activeGroup.layout);
    } else {
      setLayout("md"); // default
    }
  }, [activeGroup?.id, activeGroup?.layout]);

  const handleSetLayout = (newLayout: LayoutType) => {
    setLayout(newLayout);
    if (activeGroup && onChangeLayout) {
      onChangeLayout(activeGroup.id, newLayout);
    }
  };

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
    <div className={cn("flex flex-col h-full", className)}>
      <MainHeader activeGroup={activeGroup} onAddUrl={onAddUrl} />

      <div className="flex-1 p-6 overflow-y-auto bg-muted/10 flex flex-col">
        {activeGroup.urls.length === 0 ? (
          <EmptyUrlsState />
        ) : (
          <>
            <div className="flex justify-end mb-4 gap-1">
              <Button
                variant={layout === "sm" ? "default" : "outline"}
                size="icon"
                onClick={() => handleSetLayout("sm")}
                title="Small Grid"
              >
                <Grid3X3 size={18} />
              </Button>
              <Button
                variant={layout === "md" ? "default" : "outline"}
                size="icon"
                onClick={() => handleSetLayout("md")}
                title="Medium Grid"
              >
                <Grid2X2 size={18} />
              </Button>
              <Button
                variant={layout === "lg" ? "default" : "outline"}
                size="icon"
                onClick={() => handleSetLayout("lg")}
                title="Large Grid"
              >
                <LayoutGrid size={18} />
              </Button>
              <Button
                variant={layout === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => handleSetLayout("list")}
                title="List View"
              >
                <List size={18} />
              </Button>
            </div>
            <div className={getGridClass()}>
              {activeGroup.urls.map((entry, index) => (
                <div key={`${entry.url}-${index}`} className={layout === "list" ? "h-[500px]" : "h-full"}>
                  <IframeCard
                    url={entry.url}
                    name={entry.name}
                    pointToCenter={entry.pointToCenter}
                    onDelete={() => onDeleteUrl(index)}
                    onEdit={(url, name, pointToCenter) => onEditUrl(index, url, name, pointToCenter)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
