import type { Metadata } from "next";
import "@/index.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Web Visualizer",
  description: "Web Visualizer built with Next.js 16 and Payload CMS",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/logo.svg",
  },
};

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ClientLayout } from "./ClientLayout";
import { getPayloadUser, loginRedirectPath } from "@/lib/payload-auth";
import { isPublicAppPath } from "@/lib/auth-routes";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getPayloadUser();
  const pathname = (await headers()).get("x-pathname") ?? "/";

  if (!user && !isPublicAppPath(pathname) && pathname !== "/") {
    redirect(loginRedirectPath(pathname));
  }

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
          <ClientLayout isAuthenticated={Boolean(user)}>
            {children}
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
