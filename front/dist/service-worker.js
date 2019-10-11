importScripts("/precache-manifest.24175492f3d824df3c7ce79d26acb715.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
self.addEventListener("message", (e)=>{
    if (e.data.action=='skipWaiting') self.skipWaiting()
})
