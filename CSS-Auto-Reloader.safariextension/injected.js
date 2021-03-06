// Generated by CoffeeScript 1.3.3
(function() {
  var handleFocus, handleLoadEvent, handleMessage, pageState;

  if (window === window.top) {
    pageState = false;
    handleLoadEvent = function() {
      return safari.self.tab.dispatchMessage("load", location.protocol);
    };
    handleFocus = function() {
      return safari.self.tab.dispatchMessage("state", pageState);
    };
    handleMessage = function(event) {
      if (event.name === "autoReload") {
        switch (event.message) {
          case "start":
            document.styleSheets.start_autoreload(1000);
            return pageState = true;
          case "stop":
            document.styleSheets.stop_autoreload();
            return pageState = false;
        }
      }
    };
    window.addEventListener("pageshow", handleLoadEvent, true);
    window.addEventListener("focus", handleFocus, false);
    safari.self.addEventListener("message", handleMessage, false);
  }

}).call(this);
