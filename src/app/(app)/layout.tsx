import type { Metadata } from "next";
import "@/index.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  description: "Web Visualizer built with Next.js 16 and Payload CMS",
};

import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { redirect } from "next/navigation";
import { ClientLayout } from "./ClientLayout";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const payload = await getPayload({ config: configPromise });
  const headers = await getHeaders();
  const { user } = await payload.auth({ headers });

  if (!user) {
    redirect("/admin/login");
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans bg-background text-foreground">
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
