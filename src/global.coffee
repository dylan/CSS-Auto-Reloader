extension = safari.extension
baseURI = extension.baseURI
app = safari.application

toolbarButton = (window)->
  return toolbarItem for toolbarItem in extension.toolbarItems when toolbarItem.browserWindow is window

initializeButton = (button)->
  if extension.settings.initialState is "off" then turnOnButton(button)

turnOnButton = (button)->
  button.image = "#{baseURI}uzi.pdf"
  button.label = button.toolTip = 'Start'

turnOffButton = (button)->
  button.image = "#{baseURI}uzi-on.pdf"
  button.label = button.toolTip = 'Stop'

handleCommand = (event)->
  button = event.target
  tab = button.browserWindow.activeTab
  if button.label is 'Start'
    turnOffButton(button)
    tab.page.dispatchMessage('autoReload','start')
    notify "Ratatata!"
    return
  else
    turnOnButton(button)
    tab.page.dispatchMessage('autoReload','stop')
    notify "*click*"
    return

handleValidate = (event)->
  button = event.target
  tab = button.browserWindow.activeTab
  if !tab or (!tab.isLoading and (!tab.page or !tab.url))
    button.disabled = true
    initializeButton(button)
  else
    button.disabled = false
    if tab.isLoading then turnOnButton(button)

handleMessage = (event)->
  tab = event.target
  if tab is tab.browserWindow.activeTab
    button = toolbarButton(tab.browserWindow)
    if !button then return
    if event.name is "load"
      if event.message is "bookmarks:" or event.message is "topsites:"
        button.disabled = true
        initializeButton(button)
      else
        turnOnButton(button)
    else if event.name is "state"
      switch event.message
        when true
          turnOffButton(button)
        when false
          turnOnButton(button)

handleBeforeNavigate = (event)->
  tab = event.target
  tab.isLoading = event.url isnt null
  if tab is tab.browserWindow.activeTab
    button = toolbarButton(tab.browserWindow)
    if !button then return
    if event.url
      button.disabled = false
      turnOnButton(button)
    else
      button.disabled = true
      initializeButton(button)

notify = (message)->
  if !window.Notification
    return
  switch Notification.permissionLevel()
    when 'default'
      notify(message)
    when 'denied'
      return
    when 'granted'
      n = new Notification(message)
      return

app.addEventListener "command", handleCommand, false
app.addEventListener "message", handleMessage, false
app.addEventListener "validate", handleValidate, false
app.addEventListener "beforeNavigate", handleBeforeNavigate, true