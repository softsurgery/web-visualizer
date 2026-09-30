import React from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WebsiteData } from "@/components/main/IframeCard";
import { useIntro } from "@/contexts/IntroContext";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useVisualizer } from "@/hooks/useVisualizer";
import { useTabName } from "@/hooks/useTabName";

interface WebsiteScanData {
  title: string;
  description: string;
  generator: string;
  server: string;
}

export function WebsiteDetailsView() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const urlId = params?.urlId as string | undefined;
  
  const { setIntro } = useIntro();
  const { setRoutes } = useBreadcrumb();
  const { groups, activeGroup } = useVisualizer();
  
  const [scanData, setScanData] = React.useState<WebsiteScanData | null>(null);
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanError, setScanError] = React.useState<string | null>(null);

  const nameParam = searchParams.get("name");
  const isProxiedParam = searchParams.get("isProxied") === "true";

  const url = urlId ? decodeURIComponent(urlId) : "";
  const name = nameParam || "Website Details";
  
  useTabName(name);

  React.useEffect(() => {
    if (url) {
      const groupForUrl = groups.find((g) => g.urls.some((u) => u.url === url)) || activeGroup;
      const routes = [{ title: "Groups", href: "/" }] as { title: string; href?: string }[];
      if (groupForUrl) {
        routes.push({ title: groupForUrl.name, href: "/" });
      } else if (activeGroup) {
        routes.push({ title: activeGroup.name, href: "/" });
      }
      routes.push({ title: name });

      setRoutes?.(routes);
    }
    return () => setIntro({});
  }, [url, name, groups, activeGroup, setIntro, setRoutes]);

  React.useEffect(() => {
    if (!url) return;
    
    setIsScanning(true);
    setScanError(null);
    
    fetch(`/api/metadata?url=${encodeURIComponent(url)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to scan website");
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setScanData(data);
      })
      .catch((err) => {
        setScanError(err.message);
      })
      .finally(() => {
        setIsScanning(false);
      });
  }, [url]);

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <h2 className="text-2xl font-bold text-foreground">Details not found</h2>
        <Button onClick={() => router.push("/")} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto space-y-6">
      <div className="p-6 border border-border rounded-lg bg-card text-card-foreground shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Metadata</h3>
        <div className="flex flex-col gap-3 text-sm">
          <div className="grid grid-cols-4 gap-2 border-b border-border pb-2">
            <span className="text-muted-foreground font-medium">Name:</span>
            <span className="col-span-3 font-semibold">{name}</span>
          </div>
          <div className="grid grid-cols-4 gap-2 border-b border-border pb-2">
            <span className="text-muted-foreground font-medium">URL:</span>
            <a href={url} target="_blank" rel="noreferrer" className="col-span-3 text-primary hover:underline break-all">
              {url}
            </a>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <span className="text-muted-foreground font-medium">Connection:</span>
            <span className="col-span-3">
              {isProxiedParam ? "Proxied (Bypassing Security)" : "Direct Connection"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 border border-border rounded-lg bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Website Scan Details</h3>
          {isScanning && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
        </div>
        
        {scanError ? (
          <p className="text-sm text-destructive">Could not fetch website data: {scanError}</p>
        ) : scanData ? (
          <div className="flex flex-col gap-3 text-sm">
            <div className="grid grid-cols-4 gap-2 border-b border-border pb-2">
              <span className="text-muted-foreground font-medium">Title:</span>
              <span className="col-span-3 font-semibold">{scanData.title}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 border-b border-border pb-2">
              <span className="text-muted-foreground font-medium">Description:</span>
              <span className="col-span-3">{scanData.description}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 border-b border-border pb-2">
              <span className="text-muted-foreground font-medium">Generator:</span>
              <span className="col-span-3">{scanData.generator}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <span className="text-muted-foreground font-medium">Server:</span>
              <span className="col-span-3">{scanData.server}</span>
            </div>
          </div>
        ) : !isScanning ? (
          <p className="text-sm text-muted-foreground">No data available.</p>
        ) : (
          <p className="text-sm text-muted-foreground">Scanning...</p>
        )}
      </div>

      <div className="p-6 border border-border rounded-lg bg-card text-card-foreground shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <div className="relative bg-muted/20 border border-border rounded-md overflow-hidden" style={{ height: "600px" }}>
          {isProxiedParam ? (
            <div 
              className="w-full h-full flex flex-col bg-white text-[#202124]"
              style={{
                fontFamily: '"Segoe UI", Tahoma, sans-serif',
                paddingTop: "60px",
                paddingLeft: "10%",
                paddingRight: "10%",
              }}
            >
              <div className="max-w-[600px] w-full">
                <svg
                  className="w-12 h-12 text-[#5f6368] mb-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7zM6 20V4h6v6h6v10H6zm2.5-8.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM12 17c-2.33 0-4.32-1.45-5.12-3.5h1.67c.69 1.19 1.97 2 3.45 2s2.75-.81 3.45-2h1.67c-.8 2.05-2.79 3.5-5.12 3.5z" />
                </svg>
                <h1 className="text-2xl font-normal tracking-tight mb-4 text-[#202124]">
                  This site can't be reached
                </h1>
                <p className="text-[15px] mb-6 text-[#202124]">
                  <span className="font-bold">
                    {(() => {
                      try {
                        return new URL(url).hostname;
                      } catch (e) {
                        return url;
                      }
                    })()}
                  </span>{" "}
                  refused to connect.
                </p>
                <div className="text-[14px] text-[#5f6368]">
                  <p className="mb-4">Try:</p>
                  <ul className="list-disc pl-10 space-y-2 mb-8">
                    <li>Checking the connection</li>
                    <li>Checking the proxy and the firewall</li>
                    <li>Running Windows Network Diagnostics</li>
                  </ul>
                  <p className="text-[12px] text-[#5f6368] uppercase tracking-wider font-semibold">
                    ERR_CONNECTION_REFUSED
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              src={url}
              className="w-full h-full border-0"
              title={`Preview - ${name}`}
              scrolling="no"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default WebsiteDetailsView;
