<p align="center">
  <strong>Ram</strong> is a multi-powered Discord bot for your needs.
  <br>
  To get list of all commands, run <code>$help</code>.
  <br>
</p>

# Features
- 🔨 Moderation
- ⭐ Starboard
- 🎮 Games
- 🔒 Encryption
- ➕ Reputation
- 💵 Economy
- 🔧 Per-guild configuration
- 💏 Marriage
- 🔞 NSFW
- 🔍 Search sites

# Installation / Self Hosting
To self-host Ram, you must have the following:

- <a href="https://git-scm.com">Git</a>
- <a href="https://nodejs.org">Node.js</a>
- <a href="https://postgresql.org">PostgreSQL</a>
- An IDE, like <a href="https://code.visualstudio.com">Visual Studio Code</a> or <a href="https://atom.io">Atom</a>.

## Setup
- Clone the repository (`git clone https://github.com/smolespi/Ram`)
- Make sure PostgreSQL and Redis are started.
- Create the database `Ram` in PostgreSQL (`createdb Ram`).
- Run `npm install` to install dependencies.
- Edit the configuration values in the `.env` file.
- Run `npm run lint` to check for any errors [optional].
- To run the bot, use either `node bot` or `pm2 start ./pm2.json` (recommended if you're using an VPS).

# Author
**Ram** © [@solelychloe](https://github.com/solelychloe). Released under the [GNU](https://github.com/smolespi/Ram/blob/master/LICENSE) license.<br>
Authored by solelychloe, maintained by smolespi.
