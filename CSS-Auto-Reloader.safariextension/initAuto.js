function handleMessage(msgEvent) {
  var messageName = msgEvent.name;
  var messageData = msgEvent.message;
  if (messageName === "autoReload") {
    if (messageData === "stop") {
      document.styleSheets.stop_autoreload();
    }
    if (messageData === "start") {
      document.styleSheets.start_autoreload(1500);
    }
  }
}
safari.self.addEventListener("message", handleMessage, false);