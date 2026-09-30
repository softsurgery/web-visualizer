import { type ReactNode } from "react";
import { UIProvider } from "@/contexts/UIContext";
import { IntroProvider } from "@/contexts/IntroContext";
import { FooterProvider } from "@/contexts/FooterContext";

import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";

interface AppProvidersProps {
  children?: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <UIProvider>
      <IntroProvider>
        <FooterProvider>
          <BreadcrumbProvider>
            {children}
          </BreadcrumbProvider>
        </FooterProvider>
      </IntroProvider>
    </UIProvider>
  );
}

export default AppProviders;
