const { Collection } = require("@discordjs/collection")

const fbchat = require("fb-chat-api")
const fs = require("fs")
const chalk = require("chalk")
const logSymbols = require('log-symbols')
const { exit } = require("process")
const config = require("../config.json")

const perfix = config.perfix

console.log("Make by DinoVN#5916 \n")

let fcommands = new Collection();
let aliases = new Collection();

const facebookCommandFiles = fs
  .readdirSync('./src/commands/')
  .filter(file => file.endsWith('.js'));
for (const file of facebookCommandFiles) {
  const command = require(`./commands/${file}`);
  fcommands.set(command.name, command);
}

function Success(text) {
  process.stdout.write(chalk.green(`${logSymbols.success} ${text}`));
  process.stdout.write('\n');
}

function Error(text) {
  process.stdout.write(chalk.red(`${logSymbols.error} ${text}`))
  process.stdout.write('\n');
}

if (fs.existsSync("./appstate.json")) {
  Success("Đã tìm thấy file appstate.json đang tiếp tục")
} else {
  Error("Không tìm thấy file appstate.json")
  exit(0)
}

fbchat({ appState: JSON.parse(fs.readFileSync('./appstate.json', 'utf8')) }, (err, api) => {
  if (err) return console.error(err);

  api.setOptions({ listenEvents: true });

  var stopListening = api.listenMqtt(async (err, event) => {
    if (err) return console.error(err);

    api.markAsRead(event.threadID, (err) => {
      if (err) console.error(err);
    });

    switch (event.type) {
      case "message":
        if (event.body.startsWith(perfix)) {
          const args = event.body
            .slice(perfix.length)
            .trim()
            .split(/ +/g);
          const cmd = args.shift().toLowerCase();
          if (cmd.length === 0) return;
          let command = fcommands.get(cmd);
          if (!command) command = fcommands.get(aliases.get(cmd));
          if (command) command.run(api, event, args);
        }
        break;
    }
  });
})