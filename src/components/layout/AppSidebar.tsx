import { Sidebar } from "@/components/sidebar/Sidebar";

interface AppSidebarProps {
  variant?: "sidebar" | "floating" | "inset";
  className?: string;
}

export function AppSidebar({ variant = "inset", className }: AppSidebarProps) {
  return <Sidebar variant={variant} className={className} />;
}

export default AppSidebar;
