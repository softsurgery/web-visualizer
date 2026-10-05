"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "@/contexts/UIContext";
import { IntroProvider } from "@/contexts/IntroContext";
import { FooterProvider } from "@/contexts/FooterContext";
import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";

interface AppProvidersProps {
  children?: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider>
        <IntroProvider>
          <FooterProvider>
            <BreadcrumbProvider>{children}</BreadcrumbProvider>
          </FooterProvider>
        </IntroProvider>
      </UIProvider>
    </QueryClientProvider>
  );
}

export default AppProviders;
