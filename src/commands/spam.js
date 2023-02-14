const Spam = require("../functions/spam")
const config = require("../../config.json")

module.exports = {
  name: "spam",
  run: async (api, event, args) => {
    if(!args[0]) {
      api.sendMessage(`Thiếu số lượng dùng ${config.perfix}spam "số lượng"`, event.threadID)
      return
    }
    if(isNaN(args[0])) {
      api.sendMessage("Không thể chạy vì là số chứ ko phải là chữ", event.threadID)
      return
    }
    Spam(api,event,args[0])
  }
}