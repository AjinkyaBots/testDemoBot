let libPrefix = "gpt"

function ask(msg) {
  HTTP.get({
    url:
      "https://chatgpt.apinepdev.workers.dev/?question=" +
      encodeURIComponent(msg) +
      "",
    success: libPrefix + "onApiResponse"
  })
}

function onApiResponse() {
  let data = JSON.parse(content)
  Bot.sendMessage(data.answer)
}

publish({
  ask: ask
})

on(libPrefix + "onApiResponse", onApiResponse)
