import React from "react";
import type { Group, LayoutType } from "@/types";
import { IframeCard } from "@/components/main/iframe/IframeCard";
import {
  EmptyGroupState,
  EmptyUrlsState,
} from "@/components/main/group/EmptyState";
import { LayoutGrid, Grid3X3, Grid2X2, List, Edit2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
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
import { useUpdateGroupSheet } from "./modals/useUpdateGroupSheet";

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
  onEditGroup?: (id: string, name: string) => void;
}

export function GroupView({
  className,
  activeGroup: activeGroupProp,
  onAddUrl: onAddUrlProp,
  onEditUrl: onEditUrlProp,
  onDeleteUrl: onDeleteUrlProp,
  onChangeLayout: onChangeLayoutProp,
  onEditGroup: onEditGroupProp,
}: GroupViewProps) {
  const router = useRouter();
  const visualizer = useVisualizer();
  const activeGroup = activeGroupProp ?? visualizer.activeGroup;
  const onAddUrl = onAddUrlProp ?? visualizer.addUrl;
  const onEditUrl = onEditUrlProp ?? visualizer.editUrl;
  const onDeleteUrl = onDeleteUrlProp ?? visualizer.deleteUrl;
  const onChangeLayout = onChangeLayoutProp ?? visualizer.changeGroupLayout;
  const onEditGroup = onEditGroupProp ?? visualizer.editGroup;
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

  const { SheetFragment: EditGroupSheet, openSheet: openEditGroupSheet } =
    useUpdateGroupSheet({
      group: activeGroup,
      onEditGroup: (id, name) => {
        onEditGroup?.(id, name);
        router.push(`/?group=${encodeURIComponent(name)}`);
      },
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
      {EditGroupSheet}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-xl font-bold tracking-tight text-foreground truncate">
            {activeGroup.name}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={openEditGroupSheet}
            className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
            title="Edit Group"
          >
            <Edit2 size={16} />
          </Button>
        </div>
        <div className="flex items-center justify-end gap-1 shrink-0">
          {activeGroup.urls.length > 0 && (
            <>
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
            </>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={openAddUrlSheet}
            title="Add Website"
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>
      {activeGroup.urls.length === 0 ? (
        <EmptyUrlsState className="flex-1" onAddAction={openAddUrlSheet} />
      ) : (
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
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
