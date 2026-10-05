"use client";

import type { CSSProperties, ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useFooter } from "@/contexts/FooterContext";
import { useIntro } from "@/contexts/IntroContext";
import { useUI } from "@/contexts/UIContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Footer } from "@/components/layout/Footer";
import { AppProviders } from "@/components/providers/AppProviders";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { usePathname } from "next/navigation";
import { useVisualizer } from "@/hooks/useVisualizer";
import { Spinner } from "@/components/shared/Spinner";

interface LayoutProps {
  className?: string;
  children?: ReactNode;
}

function LayoutShell({ className, children }: LayoutProps) {
  const { title, description, floating } = useIntro();
  const { content } = useFooter();
  const { enableMainOverflow, showSidebar = true } = useUI();
  const pathname = usePathname();
  const visualizer = useVisualizer();

  const isShared =
    pathname?.startsWith("/share") ||
    visualizer.isShared ||
    (typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("shared") === "true");

  if (!visualizer.isInitialized) {
    return (
      <div className="flex h-svh w-full items-center justify-center bg-background">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <SidebarProvider
      className="h-svh overflow-hidden"
      style={
        {
          "--sidebar-width": "18rem",
          "--header-height": "3.5rem",
        } as CSSProperties
      }
    >
      {!isShared && showSidebar ? <AppSidebar variant="inset" /> : null}
      <SidebarInset className="min-h-0 overflow-hidden">
        <Header />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div
            id="main-layout"
            className={cn(
              "flex min-h-0 flex-1 flex-col gap-4 p-2 md:p-4",
              enableMainOverflow ? "overflow-auto" : "overflow-hidden",
              className,
            )}
          >
            {(title || description || floating) && (
              <div className="shrink-0 flex flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  {title && (
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  )}
                </div>
                {floating ? <div>{floating}</div> : null}
              </div>
            )}
            <div
              className={cn(
                "flex flex-col flex-1",
                enableMainOverflow
                  ? "overflow-visible"
                  : "min-h-0 overflow-hidden",
              )}
            >
              {children}
            </div>
          </div>
          {content ? (
            <div className="shrink-0">
              <Footer />
            </div>
          ) : null}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AppProviders>
      <LayoutShell>{children}</LayoutShell>
    </AppProviders>
  );
}
