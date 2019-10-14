importScripts("/precache-manifest.f62131d7604c9ef0d5b8f23e84cd5e92.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
self.addEventListener("message", (e)=>{
    if (e.data.action=='skipWaiting') self.skipWaiting()
})
