"use client";
import React from "react";
import type { Group } from "@/types";
import { useCurrentUserQuery } from "@/api";
import { GroupItem } from "@/components/sidebar/GroupItem";
import { SidebarHeader } from "@/components/sidebar/SidebarHeader";
import { SidebarActions } from "@/components/sidebar/SidebarActions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, LogIn } from "lucide-react";
import { NavUser } from "@/components/nav-user";
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
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDnDService } from "@/hooks/useDnDService";
import { SortableItem } from "@/hooks/useDnDGridService";

interface SidebarProps {
  className?: string;
  variant?: "sidebar" | "floating" | "inset";
  groups?: Group[];
  activeGroupId?: string | null;
  onAddGroup?: (name: string) => void;
  onDeleteGroup?: (id: string, e: React.MouseEvent) => void;
  onEditGroup?: (id: string, name: string) => void;
  onSetActiveGroup?: (id: string) => void;
}

export function Sidebar({
  className,
  variant = "inset",
  groups: groupsProp,
  activeGroupId: activeGroupIdProp,
  onAddGroup: onAddGroupProp,
  onDeleteGroup: onDeleteGroupProp,
  onEditGroup: onEditGroupProp,
  onSetActiveGroup: onSetActiveGroupProp,
}: SidebarProps = {}) {
  const visualizer = useVisualizer();
  const groups = groupsProp ?? visualizer.groups;
  const activeGroupId = activeGroupIdProp ?? visualizer.activeGroupId;
  const onAddGroup = onAddGroupProp ?? visualizer.addGroup;
  const onDeleteGroup = onDeleteGroupProp ?? visualizer.deleteGroup;
  const onEditGroup = onEditGroupProp ?? visualizer.editGroup;
  const onSetActiveGroup = onSetActiveGroupProp ?? visualizer.setActiveGroupId;
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const { data: userData } = useCurrentUserQuery();
  const isAuthenticated = Boolean(userData?.user);
  const isReadOnly = visualizer.isReadOnly || !isAuthenticated;

  const user = {
    name: userData?.user?.name || '',
    email: userData?.user?.email || '',
  };

  const { items: renderedGroups, handleDragEnd } = useDnDService({
    items: groups,
    setItems: visualizer.reorderGroups,
    getId: (item) => item.id,
    renderChild: (group) => (
      <GroupItem
        key={group.id}
        group={group}
        isActive={activeGroupId === group.id && pathname === "/"}
        isReadOnly={isReadOnly}
        onSelect={onSetActiveGroup}
        onDelete={onDeleteGroup}
        onEdit={onEditGroup}
      />
    ),
  });

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
            {isReadOnly ? "No groups found." : "No groups yet. Create one above!"}
          </div>
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel>Groups</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {!isReadOnly && <SidebarActions onAddGroup={onAddGroup} />}
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={groups.map(g => g.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {renderedGroups.map((rg) => (
                      <SortableItem key={rg.id} id={rg.id}>
                        {({ attributes, listeners }) => (
                          React.cloneElement(rg.child as React.ReactElement<any>, {
                            dragHandleProps: !isReadOnly ? { attributes, listeners } : undefined
                          })
                        )}
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {isAuthenticated ? (
            <>
              <NavUser user={user} />
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                  <Link href="/settings">
                    <Settings className="size-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/login">
                  <LogIn className="size-4" />
                  <span>Sign In</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
