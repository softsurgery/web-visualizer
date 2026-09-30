import React from "react";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface UseDnDGridServiceProps<T> {
  items: T[];
  getId: (item: T) => string;
  onReorder?: (newItems: T[]) => void;
}

export function useDnDGridService<T>({
  items,
  getId,
  onReorder,
}: UseDnDGridServiceProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => getId(item) === active.id);
    const newIndex = items.findIndex((item) => getId(item) === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newItems = arrayMove(items, oldIndex, newIndex);
      onReorder?.(newItems);
    }
  };

  const itemIds = items.map(getId);

  return {
    sensors,
    handleDragEnd,
    itemIds,
  };
}

export interface SortableItemProps {
  id: string;
  children: (dragHandleProps: { attributes: any; listeners: any }) => React.ReactNode;
  className?: string;
  logicalIndex?: number;
}

export function SortableItem({ id, children, className, logicalIndex }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    ...(logicalIndex !== undefined ? { order: logicalIndex } : {}),
  };

  return (
    <div ref={setNodeRef} style={style} className={className}>
      {children({ attributes, listeners })}
    </div>
  );
}
