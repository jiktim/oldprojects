## 📝 jDump
jDump (aka jikDump) is a CLI utility to export messages from a Discord server to plaintext.

This utility was made due to there not being a function in Discord itself to easily do so, and also due to there not being good utilities for it.

## ℹ PSA
This is nowhere finished. I wouldn't reccomend using it unless you wanna test stuff, at the moment.
I am **NOT** responsible if you get API banned, suspended, or whatever from Discord by using this tool.

## 🌟 Prerequisites
  - [Node.js][1] ≥10
  - [npm][2] ≥6.0.0 (or [yarn][3])

## 📚 Setup
Configuring jDump is very simple. First, you'll want to open `cfg.example.json` in a text editor. Replace the empty "" under the `token:` field with your Discord token. Rename `cfg.example.json` to `cfg.json` when you're done.

###### You can obtain your user token using the [Discord Web App][4] - open the Developer Console, navigate to `Application/Local Storage`, and refresh (this might vary depending on browser - but it's fairly straightforward). Quickly copy the token field as it'll probably go away when the app fully loads.

Next, you'll want to install the required modules for jDump. Run `npm i` (or `yarn` if you prefer) at the root of the directory. If you have Node.js configured correctly, it should work fine.

Finally, you'll want to run jDump by opening a new terminal/console window and typing `npm run jdump`. jDump should start & prompt you thru the dumping process.

## 📃 Todo
  - [ ] Make the dumps go to their own directory
  - [ ] Fix console overflow w/ long lengths
  - [ ] Make the script end properly
  - [ ] Permission checker
  - [ ] Image handler (maybe export the proxy_url as the content?)
  - [ ] Export to JSON or markdown instead of plaintext for beautiful logs
  - [ ] Split messages up based on day
  - [ ] Support DMs, groups, etc(?) (add a seperate first menu to select.. idk how we'd get open dms. Maybe by user ID?)
  - [ ] Embed handler (attempt to export the "description" part of the embed?)
  - [ ] Split the messages into multiple text files if one file gets too big
  - [ ] Fix the invalid handler token (maybe do it by auth code? i.e if 401 error?)
  - [ ] Add a config option to export IDs for things such as reports, etc

## ✨ Additional Credits
  - [resolved][5] - wrote the original script

[1]: https://nodejs.org/en/download/ "Node.js Download"
[2]: https://www.npmjs.com/get-npm "Get NPM"
[3]: https://yarnpkg.com/ "Yarn"
[4]: https://discordapp.com/channels/@me "Discord Web App"
[5]: https://github.com/resolvedxd "Resolved"
