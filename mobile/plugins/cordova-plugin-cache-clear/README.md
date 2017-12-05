Cache Clear
=============

This is a WebView cache plugin for Cordova 6.1.1+ supporting Android (>=4.1) and iOS(>=6.0).
It allows to clear the cordova webview cache.

There is one method:

* CacheClear(successCallback, errorCallback)

Installation
======
You may use Cordova CLI as follows:

<pre>
cordova plugin add cordova-plugin-cache-clear
</pre>

Usage
====
```javascript
document.addEventListener('deviceready', function() {
    var success = function(status) {
        alert('Message: ' + status);
    };
    var error = function(status) {
        alert('Error: ' + status);
    };
    window.CacheClear(success, error);
});
```

Android vs. iOS
======

On iOS, CacheClear deletes temporary files (images that have been downloaded by the app).
On Android, CacheClear also deletes all local, persistent data (such as stored files and any data saved to localStorage).
