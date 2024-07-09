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
    mongoUrl: process.env.mongoUrl || "", // Mongodb url for database
    geniusToken: process.env.geniusToken || "", // Genius token use to fetch lyrics, you can leave it blank.
    prefix: process.env.prefix || "?", // Default prefix is set to "?" use prefix command to change
    embedColor: process.env.embedColor || "2F3136", // You can use any HEX Color but without the "#"
  },

  // Lavalink settings. Please use lavalink v4
  // You can remove docker-node if youre not using docker to run the bot.
  nodes: [
    {
      name: "docker-node",
      host: "docker.lavalink",
      password: "youshallnotpass",
      port: 2333,
      secure: false,
    },
    {
      name: "node-1",
      host: "localhost",
      password: "youshallnotpass",
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
