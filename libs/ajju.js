function sendMsg(msg) {
  Bot.sendMessage(msg)
}

publish({
  sendMsg: sendMsg,
})
