console.log("HELLO FROM BROWSER-CLIENT.js");

if ('serviceWorker' in navigator) {
    try {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register(window.location.href+'/service-worker.js').then(function(registration) {
                console.log('Service worker registered with scope: ', registration.scope);
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
    catch(err) {
        console.log(err);
        error(err);
    }
  }
else {
    error("There wasn't an instanceof serviceWorker in the navigator object");
}

function error(err) {
    document.head.innerHTML = "";
    document.body.innerHTML = '<p3>There was an error due to the service worker API.<br>It might not be enabled in certain browsers or in incognito (you dont need incognito due to the scrambled urls).<br>This proxy cannot work without it.</p3><br><a href="'+"../"+'"> Click this to head back to the homepage</a><br>';
    document.body.innerHTML = document.body.parentElement.innerHTML + '<p3>Additional information: '+ err +'</p3>'
}