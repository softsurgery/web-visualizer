import React from "react";
import { Globe } from "lucide-react";
import { cn } from "cn";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <div
      className={cn("flex items-center gap-2 text-(--theme-text)", className)}
    >
      <Globe className="size-6" />
      <span className="text-xl font-semibold">Web Visualizer</span>
    </div>
  );
};
