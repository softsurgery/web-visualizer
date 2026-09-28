import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const iframeProxyPlugin = (): Plugin => {
  return {
    name: "iframe-proxy",
    configureServer(server) {
      server.middlewares.use("/__check-frameable", async (req, res, next) => {
        try {
          const urlStr = req.url || "";
          const urlParam = new URL(
            urlStr,
            `http://${req.headers.host}`,
          ).searchParams.get("url");
          if (!urlParam) {
            return next();
          }
          const targetUrl = new URL(urlParam);
          // Try HEAD first, fallback to GET if HEAD fails
          let response = await fetch(targetUrl, {
            method: "HEAD",
            headers: { "User-Agent": "Mozilla/5.0" },
          });
          if (!response.ok && response.status === 405) {
            response = await fetch(targetUrl, {
              method: "GET",
              headers: { "User-Agent": "Mozilla/5.0" },
            });
          }
          const xFrameOptions = response.headers
            .get("x-frame-options")
            ?.toLowerCase();
          const csp = response.headers
            .get("content-security-policy")
            ?.toLowerCase();

          let frameable = true;
          if (
            xFrameOptions &&
            (xFrameOptions.includes("deny") ||
              xFrameOptions.includes("sameorigin"))
          ) {
            frameable = false;
          }
          if (csp && csp.includes("frame-ancestors")) {
            frameable = false;
          }

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ frameable }));
        } catch (e) {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ frameable: false }));
        }
      });

      server.middlewares.use("/__proxy", async (req, res, next) => {
        try {
          const urlStr = req.url || "";
          const urlParam = new URL(
            urlStr,
            `http://${req.headers.host}`,
          ).searchParams.get("url");
          if (!urlParam) {
            return next();
          }

          const targetUrl = new URL(urlParam);

          let bodyBuf = Buffer.alloc(0);
          if (req.method !== "GET" && req.method !== "HEAD") {
            for await (const chunk of req) {
              bodyBuf = Buffer.concat([bodyBuf, chunk]);
            }
          }

          const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
              "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
              Accept: req.headers["accept"] || "*/*",
              ...(req.headers["content-type"]
                ? { "Content-Type": req.headers["content-type"] }
                : {}),
            },
            body:
              req.method !== "GET" && req.method !== "HEAD"
                ? bodyBuf
                : undefined,
          });

          const headersObj: Record<string, string | string[]> = {};
          response.headers.forEach((value, key) => {
            const lowerKey = key.toLowerCase();
            if (
              ![
                "x-frame-options",
                "content-security-policy",
                "content-security-policy-report-only",
                "strict-transport-security",
              ].includes(lowerKey)
            ) {
              headersObj[key] = value;
            }
          });

          // Inject permissive CORS
          headersObj["Access-Control-Allow-Origin"] = "*";
          headersObj["Access-Control-Allow-Methods"] =
            "GET, POST, PUT, DELETE, OPTIONS";
          headersObj["Access-Control-Allow-Headers"] = "*";

          res.writeHead(response.status, headersObj);

          const arrayBuffer = await response.arrayBuffer();
          res.end(Buffer.from(arrayBuffer));
        } catch (error: any) {
          console.error("Proxy error:", error);
          res.statusCode = 500;
          res.end(error.message);
        }
      });
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), iframeProxyPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
