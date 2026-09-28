import { X } from 'lucide-react';

interface SidebarHeaderProps {
  onClose: () => void;
}

export function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <div className="p-4 border-b border-border flex justify-between items-center bg-background text-foreground">
      <h1 className="font-bold text-xl tracking-tight">Visualizer</h1>
      <button
        className="md:hidden p-1 hover:bg-muted rounded transition"
        onClick={onClose}
      >
        <X size={20} />
      </button>
    </div>
  );
}
