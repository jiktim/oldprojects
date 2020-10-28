/*
  Hibiki ValidItems Module

  This sets valid setup items & their info.
*/

module.exports = [{
  id: "agreeChannel",
  emoji: "💬",
  label: "💬 Agree Channel",
  type: "channelID",
  typelabel: "Channel",
  description: "The channel where agree can be run."
}, {
  id: "agreeRole",
  emoji: "✅",
  label: "✅ Agree Role",
  type: "roleID",
  typelabel: "Role",
  description: "The role given when the agree command is run."
}, {
  id: "autorole",
  emoji: "🏷",
  label: "🏷 Auto Role",
  type: "roleArray",
  maximum: 3,
  typelabel: "Roles",
  description: "One or more roles automatically given to new members."
}, {
  id: "easyTranslate",
  emoji: "🌍",
  label: "🌍 Easy Translate",
  type: "bool",
  typelabel: "Option",
  description: "Automatically translate content reacted to with a flag emoji.",
}, {
  id: "leavejoin",
  emoji: "👋",
  label: "👋 Leave/Join Channel",
  type: "channelID",
  typelabel: "Channel",
  description: "The channel that leave/join messages will be sent.",
}, {
  id: "joinMessage",
  emoji: "👍",
  label: "👍 Join Message",
  type: "string",
  typelabel: "Text",
  description: "The join message. Supports `{member}` `{membercount}` `{guildname}`.",
}, {
  id: "leaveMessage",
  emoji: "👎",
  label: "👎 Leave Message",
  type: "string",
  typelabel: "Text",
  description: "The leave message. Supports `{member}` `{membercount}` `{guildname}`.",
}, {
  id: "guildLogging",
  emoji: "📃",
  label: "📃 Guild Logging Channel",
  type: "channelID",
  typelabel: "Channel",
  description: "The channel that guild logging events will be sent."
}, {
  id: "modLogging",
  emoji: "📜",
  label: "📜 Mod Logging Channel",
  type: "channelID",
  typelabel: "Channel",
  description: "The channel that moderation logging events will be sent."
}, {
  id: "muted",
  emoji: "🔇",
  label: "🔇 Muted Role",
  type: "roleID",
  typelabel: "Role",
  description: "The role given to a user when they're muted.",
}, {
  id: "staffrole",
  emoji: "🔨",
  label: "🔨 Staff Role",
  type: "roleID",
  typelabel: "Role",
  description: "The optional role that can run staff commands."
}, {
  id: "starAmount",
  emoji: "🌟",
  label: "🌟 Star Amount",
  type: "number",
  typelabel: "Number",
  description: "The number of star reactions needed to post to the Starboard."
}, {
  id: "starChannel",
  emoji: "⭐",
  label: "⭐ Star Channel",
  type: "channelID",
  typelabel: "Channel",
  description: "The channel that the starboard posts to."
}, {
  id: "starEmoji",
  emoji: "🌠",
  label: "🌠 Star Emoji",
  type: "emoji",
  typelabel: "Emoji",
  description: "The emoji reaction that starboard will look for.",
  maximum: 1,
  minimum: 1,
}, {
  id: "starSelfStarring",
  emoji: "✡️",
  label: "✡️ Prevent self starring",
  type: "bool",
  typelabel: "bool",
  description: "If enabled won't let users star their own messages.",
}, {
  id: "verified",
  emoji: "☑",
  label: "☑ Verified Role",
  type: "roleID",
  typelabel: "Role",
  description: "The role given to a user when they're verified.",
}, {
  emoji: "📎",
  label: "📎 Anti Invite",
  description: "Whenever an invite is posted, apply the set punishment to the user.",
  id: "AntiInvite",
  type: "bool"
}, {
  emoji: "🔨",
  label: "🔨 Invite Punishment",
  description: "Punishments applied when an invite is posted.",
  id: "invitePunishments",
  pickerLabel: "sending an invite",
  type: "punishment",
}, {
  emoji: "🚫",
  label: "🚫 Anti Spam",
  description: "Attempts to automatically prevent/moderate spam.",
  id: "AntiSpam",
  type: "bool"
}, {
  emoji: "🔢",
  label: "🔢 Spam Threshold",
  description: "The threshold before automatically punishing spamming members. (7 by default)",
  id: "spamThreshold",
  minimum: 5,
  maximum: 10,
  type: "number"
}, {
  emoji: "💭",
  label: "💭 Msg on punish",
  description: "Sends a message when a punishment is applied by automod",
  id: "msgOnPunishment",
  type: "bool"
}, {
  emoji: "🔕",
  label: "🔕 Spam Punishment",
  description: "Punishments applied when a user spams.",
  id: "spamPunishments",
  pickerLabel: "spam",
  type: "punishment"
}, {
  emoji: "🤖",
  label: "🤖 Prefix",
  description: "The prefix the bot uses.",
  id: "prefix",
  type: "string",
  minimum: 1,
  maximum: 15
}, {
  emoji: "📵",
  label: "📵 Disabled Categories",
  id: "disabledCategories",
  type: "array"
}, {
  emoji: "⛔",
  label: "⛔ Disabled Commands",
  id: "disabledCmds",
  type: "array"
}];
