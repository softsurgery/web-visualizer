import React from "react";
import type { Group, LayoutType } from "@/types";
import { IframeCard } from "@/components/main/iframe/IframeCard";
import { AddUrlCard } from "@/components/main/iframe/forms/AddUrlCard";
import {
  EmptyGroupState,
  EmptyUrlsState,
} from "@/components/main/group/EmptyState";
import { LayoutGrid, Grid3X3, Grid2X2, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVisualizer } from "@/hooks/useVisualizer";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDnDGridService, SortableItem } from "@/hooks/useDnDGridService";
import { useTabName } from "@/hooks/useTabName";
import { useCreateUrlSheet } from "../iframe/modals/useCreateURLSheet";

interface GroupViewProps {
  className?: string;
  activeGroup?: Group;
  onAddUrl?: (url: string, name: string, pointToCenter?: boolean) => void;
  onEditUrl?: (
    index: number,
    url: string,
    name: string,
    pointToCenter?: boolean,
  ) => void;
  onDeleteUrl?: (index: number) => void;
  onChangeLayout?: (id: string, layout: LayoutType) => void;
}

export function GroupView({
  className,
  activeGroup: activeGroupProp,
  onAddUrl: onAddUrlProp,
  onEditUrl: onEditUrlProp,
  onDeleteUrl: onDeleteUrlProp,
  onChangeLayout: onChangeLayoutProp,
}: GroupViewProps) {
  const visualizer = useVisualizer();
  const activeGroup = activeGroupProp ?? visualizer.activeGroup;
  const onAddUrl = onAddUrlProp ?? visualizer.addUrl;
  const onEditUrl = onEditUrlProp ?? visualizer.editUrl;
  const onDeleteUrl = onDeleteUrlProp ?? visualizer.deleteUrl;
  const onChangeLayout = onChangeLayoutProp ?? visualizer.changeGroupLayout;
  const { setRoutes } = useBreadcrumb();

  useTabName(activeGroup ? activeGroup.name : "Web Visualizer");

  React.useEffect(() => {
    if (activeGroup) {
      setRoutes?.([
        { title: "Groups", href: "/" },
        { title: activeGroup.name, href: "/" },
      ]);
    } else {
      setRoutes?.([{ title: "Groups", href: "/" }]);
    }
  }, [activeGroup, setRoutes]);

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

  const handleReorder = (newUrls: typeof activeGroup.urls) => {
    if (activeGroup && visualizer.reorderUrls) {
      visualizer.reorderUrls(activeGroup.id, newUrls);
    }
  };

  const { sensors, handleDragEnd, itemIds } = useDnDGridService({
    items: activeGroup?.urls || [],
    getId: (item) => `${item.url}-${item.name}`,
    onReorder: handleReorder,
  });

  const { SheetFragment: AddUrlSheet, openSheet: openAddUrlSheet } =
    useCreateUrlSheet({
      groupName: activeGroup?.name,
      onAddUrl: (url, name, ptc) => onAddUrl && onAddUrl(url, name, ptc),
    });

  if (!activeGroup) {
    return <EmptyGroupState />;
  }

  const stableUrls = [...activeGroup.urls].sort((a, b) => {
    return `${a.url}-${a.name}`.localeCompare(`${b.url}-${b.name}`);
  });

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
    <div className={cn("flex flex-col gap-4 w-full flex-1 h-full", className)}>
      {AddUrlSheet}
      {activeGroup.urls.length === 0 ? (
        <EmptyUrlsState className="flex-1" onAddAction={openAddUrlSheet} />
      ) : (
        <>
          <div className="flex justify-end gap-1">
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={itemIds}
              strategy={
                layout === "list"
                  ? verticalListSortingStrategy
                  : rectSortingStrategy
              }
            >
              <div className={getGridClass()}>
                {stableUrls.map((entry) => {
                  const id = `${entry.url}-${entry.name}`;
                  const logicalIndex = activeGroup.urls.findIndex(
                    (u) => `${u.url}-${u.name}` === id,
                  );
                  if (logicalIndex === -1) return null;

                  return (
                    <SortableItem
                      key={id}
                      id={id}
                      logicalIndex={logicalIndex}
                      className={layout === "list" ? "h-125" : "h-full"}
                    >
                      {(dragHandleProps) => (
                        <IframeCard
                          url={entry.url}
                          name={entry.name}
                          pointToCenter={entry.pointToCenter}
                          onDelete={() => onDeleteUrl(logicalIndex)}
                          onEdit={(url, name, pointToCenter) =>
                            onEditUrl(logicalIndex, url, name, pointToCenter)
                          }
                          dragHandleProps={dragHandleProps}
                        />
                      )}
                    </SortableItem>
                  );
                })}
                <div
                  className={layout === "list" ? "h-125" : "h-full"}
                  style={{ order: 9999 }}
                >
                  <AddUrlCard
                    groupName={activeGroup.name}
                    onAddUrl={(url, name, ptc) =>
                      onAddUrl && onAddUrl(url, name, ptc)
                    }
                  />
                </div>
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
}
