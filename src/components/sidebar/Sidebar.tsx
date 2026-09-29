import React from "react";
import type { Group } from "@/types";
import { GroupItem } from "@/components/sidebar/GroupItem";
import { SidebarHeader } from "@/components/sidebar/SidebarHeader";
import { SidebarActions } from "@/components/sidebar/SidebarActions";
import { Link, useLocation } from "react-router-dom";
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

interface SidebarProps {
  className?: string;
  groups: Group[];
  activeGroupId: string | null;
  onAddGroup: (name: string) => void;
  onDeleteGroup: (id: string, e: React.MouseEvent) => void;
  onSetActiveGroup: (id: string) => void;
}

export function Sidebar({
  className,
  groups,
  activeGroupId,
  onAddGroup,
  onDeleteGroup,
  onSetActiveGroup,
}: SidebarProps) {
  const location = useLocation();

  return (
    <ShadcnSidebar variant="inset" className={className}>
      <ShadcnSidebarHeader>
        <SidebarHeader />
      </ShadcnSidebarHeader>

      <SidebarContent>
        {groups.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No groups yet. Create one above!
          </div>
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel>Groups</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {groups.map((group) => (
                  <GroupItem
                    key={group.id}
                    group={group}
                    isActive={activeGroupId === group.id && location.pathname === "/"}
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
            <SidebarMenuButton render={<Link to="/settings" />} isActive={location.pathname === "/settings"}>
              <Settings className="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarActions onAddGroup={onAddGroup} />
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
