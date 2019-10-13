importScripts("/precache-manifest.7c609c4c0ce5018b5dfd6970dcbfbbc2.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
self.addEventListener("message", (e)=>{
    if (e.data.action=='skipWaiting') self.skipWaiting()
})
