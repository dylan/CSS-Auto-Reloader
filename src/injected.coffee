# Make sure we arent doing this crap for all the cute iframes...
if window is window.top
  # Safe whether the extension is running
  pageState = false
  
  handleLoadEvent = ()->
    safari.self.tab.dispatchMessage("load", location.protocol)
  
  handleFocus = ()->
    safari.self.tab.dispatchMessage("state", pageState)
  
  handleMessage = (event)->
    if event.name is "autoReload"
      switch event.message
        when "start"
          document.styleSheets.start_autoreload(1000)
          pageState = true
        when "stop"
          document.styleSheets.stop_autoreload()
          pageState = false

  window.addEventListener "pageshow", handleLoadEvent, true
  window.addEventListener "focus", handleFocus, false
  safari.self.addEventListener "message", handleMessage, false