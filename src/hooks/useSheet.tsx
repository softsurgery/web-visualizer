"use client";
import React from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRTL } from "./useRTL";

interface UseSheetOptions {
  children?:
    React.ReactNode | ((isOpen: boolean, close: () => void) => React.ReactNode);
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  onToggle?: () => void;
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
}

export function useSheet({
  children,
  title,
  description,
  className,
  headerClassName,
  onToggle,
  side,
  showCloseButton,
}: UseSheetOptions) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isRTL } = useRTL();
  const resolvedSide = side ?? (isRTL ? "left" : "right");

  const openSheet = () => setIsOpen(true);
  const closeSheet = () => setIsOpen(false);

  const SheetFragment = (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          onToggle?.();
        }
      }}
    >
      <SheetContent
        side={resolvedSide}
        showCloseButton={showCloseButton}
        className={cn("overflow-y-auto", className)}
      >
        {(title || description) && (
          <SheetHeader className={headerClassName}>
            {title && <SheetTitle className="font-bold">{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}

        {typeof children === "function"
          ? children(isOpen, closeSheet)
          : children}
      </SheetContent>
    </Sheet>
  );

  return { SheetFragment, openSheet, closeSheet, isOpen };
}
