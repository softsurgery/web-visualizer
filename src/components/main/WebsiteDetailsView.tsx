import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WebsiteData } from "@/components/main/IframeCard";
import { useIntro, useBreadcrumb, useVisualizer } from "@/contexts";

interface WebsiteScanData {
  title: string;
  description: string;
  generator: string;
  server: string;
}

export function WebsiteDetailsView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { urlId } = useParams();
  const { setIntro } = useIntro();
  const { setRoutes } = useBreadcrumb();
  const { groups, activeGroup } = useVisualizer();
  
  const [scanData, setScanData] = React.useState<WebsiteScanData | null>(null);
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanError, setScanError] = React.useState<string | null>(null);

  // Read data from route state if available
  const websiteData = location.state as WebsiteData | null;
  const url = urlId ? decodeURIComponent(urlId) : websiteData?.url;

  React.useEffect(() => {
    if (url) {
      const groupForUrl = groups.find((g) => g.urls.some((u) => u.url === url)) || activeGroup;
      const groupName = groupForUrl?.name || "Group";

      setIntro({
        title: websiteData?.name || "Website Details",
        description: url,
      });
      setRoutes?.([
        { title: "Groups", href: "/" },
        { title: groupName, href: "/" },
        { title: websiteData?.name || url },
      ]);
    }
    return () => setIntro({});
  }, [url, websiteData?.name, groups, activeGroup, setIntro, setRoutes]);

  React.useEffect(() => {
    if (!url) return;
    
    setIsScanning(true);
    setScanError(null);
    
    fetch(`/__metadata?url=${encodeURIComponent(url)}`)
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
        <Button onClick={() => navigate("/")} className="mt-4">Go Back</Button>
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
            <span className="col-span-3 font-semibold">{websiteData?.name || "Unknown"}</span>
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
              {websiteData?.isProxied ? "Proxied (Bypassing Security)" : "Direct Connection"}
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
          <iframe
            src={websiteData?.isProxied ? `/__proxy?url=${encodeURIComponent(url)}` : url}
            className="w-full h-full border-0"
            title={`Preview - ${websiteData?.name || url}`}
            scrolling="no"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  );
}

export default WebsiteDetailsView;
