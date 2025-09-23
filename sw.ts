/// <reference lib="WebWorker" />
declare var self: ServiceWorkerGlobalScope;

self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request).then((response) => {
      const cloned = response.clone();
      caches.open("v1").then((cache) => cache.put(e.request, cloned));
      return response;
    }).catch(async (error) => {
      const cached = await caches.match(e.request);
      if (cached) return cached;
      else {
        return new Response(JSON.stringify(error), {
          status: 408,
          headers: { "Content-Type": "application/json" },
        });
      }
    }),
  );
});
