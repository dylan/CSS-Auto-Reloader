// Generated by CoffeeScript 1.3.3
(function() {
  var app, baseURI, extension, handleBeforeNavigate, handleCommand, handleMessage, handleValidate, initializeButton, notify, toolbarButton, turnOffButton, turnOnButton;

  extension = safari.extension;

  baseURI = extension.baseURI;

  app = safari.application;

  toolbarButton = function(window) {
    var toolbarItem, _i, _len, _ref;
    _ref = extension.toolbarItems;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      toolbarItem = _ref[_i];
      if (toolbarItem.browserWindow === window) {
        return toolbarItem;
      }
    }
  };

  initializeButton = function(button) {
    if (extension.settings.initialState === "off") {
      return turnOnButton(button);
    }
  };

  turnOnButton = function(button) {
    button.image = "" + baseURI + "uzi.pdf";
    return button.label = button.toolTip = 'Start';
  };

  turnOffButton = function(button) {
    button.image = "" + baseURI + "uzi-on.pdf";
    return button.label = button.toolTip = 'Stop';
  };

  handleCommand = function(event) {
    var button, tab;
    button = event.target;
    tab = button.browserWindow.activeTab;
    if (button.label === 'Start') {
      turnOffButton(button);
      tab.page.dispatchMessage('autoReload', 'start');
      notify("Ratatata!");
    } else {
      turnOnButton(button);
      tab.page.dispatchMessage('autoReload', 'stop');
      notify("*click*");
    }
  };

  handleValidate = function(event) {
    var button, tab;
    button = event.target;
    tab = button.browserWindow.activeTab;
    if (!tab || (!tab.isLoading && (!tab.page || !tab.url))) {
      button.disabled = true;
      return initializeButton(button);
    } else {
      button.disabled = false;
      if (tab.isLoading) {
        return turnOnButton(button);
      }
    }
  };

  handleMessage = function(event) {
    var button, tab;
    tab = event.target;
    if (tab === tab.browserWindow.activeTab) {
      button = toolbarButton(tab.browserWindow);
      if (!button) {
        return;
      }
      if (event.name === "load") {
        if (event.message === "bookmarks:" || event.message === "topsites:") {
          button.disabled = true;
          return initializeButton(button);
        } else {
          return turnOnButton(button);
        }
      } else if (event.name === "state") {
        switch (event.message) {
          case true:
            return turnOffButton(button);
          case false:
            return turnOnButton(button);
        }
      }
    }
  };

  handleBeforeNavigate = function(event) {
    var button, tab;
    tab = event.target;
    tab.isLoading = event.url !== null;
    if (tab === tab.browserWindow.activeTab) {
      button = toolbarButton(tab.browserWindow);
      if (!button) {
        return;
      }
      if (event.url) {
        button.disabled = false;
        return turnOnButton(button);
      } else {
        button.disabled = true;
        return initializeButton(button);
      }
    }
  };

  notify = function(message) {
    var n;
    if (!window.Notification) {
      return;
    }
    switch (Notification.permissionLevel()) {
      case 'default':
        return notify(message);
      case 'denied':
        break;
      case 'granted':
        n = new Notification(message);
    }
  };

  app.addEventListener("command", handleCommand, false);

  app.addEventListener("message", handleMessage, false);

  app.addEventListener("validate", handleValidate, false);

  app.addEventListener("beforeNavigate", handleBeforeNavigate, true);

}).call(this);
