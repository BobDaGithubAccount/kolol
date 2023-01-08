console.log("HELLO FROM SERVICE-WORKER.js");

self.addEventListener("install", (event) => {
    console.log("Service worker installed");
 });
 self.addEventListener("activate", (event) => {
    console.log("Service worker activated");
 });

self.addEventListener('fetch', function(event) {
    console.log(event.request);
});