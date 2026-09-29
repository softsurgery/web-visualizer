import { X } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { cn } from "cn";

interface SidebarHeaderProps {
  className?: string;
  onClose: () => void;
}

export function SidebarHeader({ className, onClose }: SidebarHeaderProps) {
  return (
    <div className={cn("p-4 border-b border-border flex justify-between items-center bg-background text-foreground", className)}>
      <h1 className="font-bold text-xl tracking-tight">Visualizer</h1>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onClose}
        >
          <X size={20} />
        </Button>
      </div>
    </div>
  );
}
