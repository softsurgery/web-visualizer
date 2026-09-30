import { type ReactNode } from "react";
import {
  UIProvider,
  IntroProvider,
  FooterProvider,
  VisualizerProvider,
  BreadcrumbProvider,
} from "@/contexts";

interface AppProvidersProps {
  children?: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <VisualizerProvider>
      <UIProvider>
        <IntroProvider>
          <FooterProvider>
            <BreadcrumbProvider>
              {children}
            </BreadcrumbProvider>
          </FooterProvider>
        </IntroProvider>
      </UIProvider>
    </VisualizerProvider>
  );
}

export default AppProviders;
