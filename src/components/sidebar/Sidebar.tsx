import React from "react";
import type { Group } from "@/types";
import { GroupItem } from "@/components/sidebar/GroupItem";
import { SidebarHeader } from "@/components/sidebar/SidebarHeader";
import { SidebarActions } from "@/components/sidebar/SidebarActions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader as ShadcnSidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { useVisualizer } from "@/hooks/useVisualizer";

interface SidebarProps {
  className?: string;
  variant?: "sidebar" | "floating" | "inset";
  groups?: Group[];
  activeGroupId?: string | null;
  onAddGroup?: (name: string) => void;
  onDeleteGroup?: (id: string, e: React.MouseEvent) => void;
  onSetActiveGroup?: (id: string) => void;
}

export function Sidebar({
  className,
  variant = "inset",
  groups: groupsProp,
  activeGroupId: activeGroupIdProp,
  onAddGroup: onAddGroupProp,
  onDeleteGroup: onDeleteGroupProp,
  onSetActiveGroup: onSetActiveGroupProp,
}: SidebarProps = {}) {
  const visualizer = useVisualizer();
  const groups = groupsProp ?? visualizer.groups;
  const activeGroupId = activeGroupIdProp ?? visualizer.activeGroupId;
  const onAddGroup = onAddGroupProp ?? visualizer.addGroup;
  const onDeleteGroup = onDeleteGroupProp ?? visualizer.deleteGroup;
  const onSetActiveGroup = onSetActiveGroupProp ?? visualizer.setActiveGroupId;
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ShadcnSidebar variant={variant} className={className}>
      <ShadcnSidebarHeader>
        <SidebarHeader />
      </ShadcnSidebarHeader>

      <SidebarContent>
        {!mounted ? (
           <SidebarGroup>
             <SidebarGroupLabel>Groups</SidebarGroupLabel>
           </SidebarGroup>
        ) : groups.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No groups yet. Create one above!
          </div>
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel>Groups</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarActions onAddGroup={onAddGroup} />
                {groups.map((group) => (
                  <GroupItem
                    key={group.id}
                    group={group}
                    isActive={activeGroupId === group.id && pathname === "/"}
                    onSelect={onSetActiveGroup}
                    onDelete={onDeleteGroup}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/settings" />} isActive={pathname === "/settings"}>
              <Settings className="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
