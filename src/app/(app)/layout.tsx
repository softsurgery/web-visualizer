import type { Metadata } from "next";
import "@/index.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  description: "Web Visualizer built with Next.js 16 and Payload CMS",
};

import { ClientLayout } from "./ClientLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased font-sans bg-background text-foreground"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
