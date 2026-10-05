import React from "react";
import { cn } from "cn";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <div
      className={cn("flex items-center gap-2.5 text-(--theme-text)", className)}
    >
      <img
        src="/logo.svg"
        alt="Web Visualizer Logo"
        width={28}
        height={28}
        className="size-7 rounded-md object-contain"
      />
      <span className="text-xl font-semibold tracking-tight">Web Visualizer</span>
    </div>
  );
};

export const Icon = ({ className }: LogoProps) => {
  return (
    <img
      src="/logo.svg"
      alt="Web Visualizer Icon"
      width={24}
      height={24}
      className={cn("size-6 rounded-md object-contain", className)}
    />
  );
};

