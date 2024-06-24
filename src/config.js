const { ActivityType } = require("discord.js");
require("dotenv").config();

module.exports = {
  bot: {
    token: process.env.token || "", // Bot token
    clientName: process.env.clientName || "SomeCoolName", // Bot username
    clientId: process.env.clientId || "", // Bot clientId
    clientSecret: process.env.clientSecret || "", // Bot clientSecret
  },

  owner: {
    userId: process.env.userId || "", // Owner userId for developer command
  },

  botSettings: {
    mongoUrl: process.env.mongoUrl || "", // You can leave it blank, mongo is not setup yet
    geniusToken: process.env.geniusToken || "", // Use to fetch lyrics, you can leave it blank.
    prefix: process.env.prefix || "?", // You can leave it blank, prefix function is not setup yet
    embedColor: process.env.embedColor || "2F3136", // You can use any HEX Color but without the "#"
  },

  // Lavalink settings. Please use lavalink v4
  nodes: [
    {
      name: "node1",
      host: "node.shittybot.xyz",
      password: "shittybot",
      port: 2333,
      secure: false,
    },
  ],

  // Client Presence
  presence: {
    activities: [
      {
        name: "/play",
        type: ActivityType.Listening,
      },
    ],
    status: "online",
  },
};
