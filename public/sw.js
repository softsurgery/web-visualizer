const clientTargets = new Map();

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Allow the proxy entry point to pass through normally, 
  // but track the mapping of clientId to target URL
  if (url.pathname === '/__proxy') {
    const targetUrl = url.searchParams.get('url');
    if (targetUrl) {
      if (event.request.mode === 'navigate' && event.resultingClientId) {
        clientTargets.set(event.resultingClientId, targetUrl);
      } else if (event.clientId) {
        clientTargets.set(event.clientId, targetUrl);
      }
    }
    return;
  }

  // Intercept requests from the established iframes
  const clientId = event.clientId;
  if (clientId && clientTargets.has(clientId)) {
    // Bypass Vite's internal development server requests
    if (url.origin === self.location.origin && 
        (url.pathname.startsWith('/@') || 
         url.pathname.startsWith('/node_modules') || 
         url.pathname.startsWith('/src/') ||
         url.pathname === '/index.html' ||
         url.pathname === '/')) {
      return; 
    }

    let trueUrl = url.href;
    
    // If the iframe requested a relative path, it resolves to our localhost origin.
    // We rewrite it to point to the actual target origin.
    if (url.origin === self.location.origin) {
      const targetBase = clientTargets.get(clientId);
      const targetUrlObj = new URL(targetBase);
      trueUrl = targetUrlObj.origin + url.pathname + url.search;
    }

    const proxyUrl = `/__proxy?url=${encodeURIComponent(trueUrl)}`;
    
    // Forward the request through our Vite backend proxy
    event.respondWith(
      fetch(proxyUrl, {
        method: event.request.method,
        headers: event.request.headers,
        body: (event.request.method !== 'GET' && event.request.method !== 'HEAD') ? event.request.body : undefined,
        mode: 'cors',
        redirect: 'manual'
      }).catch(err => {
        return new Response('Proxy error: ' + err.message, { status: 500 });
      })
    );
  }
});
