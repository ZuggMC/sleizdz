const fs = require("fs")
const config = require("../../config.json")

function chat(api,event,content) {
  // setTimeout(() => {
    console.log("spam")
  api.sendMessage(content, event.threadID)
  // }, config.delay * 1000)
}

function Content() {
  const txt = fs.readFileSync('./content.txt', 'utf8')
  let content
  if (txt == "") content = "Chưa ghi gì trong file content.txt cả"
  else content = txt
  return content
}

function Spam(api, event, number) {
  const content = Content()
  let i = 0
  let time = setInterval(() => {
    i = i + 1
    // console.log(i > number)
    if (i > number) return clearInterval(time)
    chat(api,event,content)
  }, config.delay * 1000);
  // for(i = 0; i < number; i++){
  //   chat(api,event,content)
  // }
}

module.exports = Spam