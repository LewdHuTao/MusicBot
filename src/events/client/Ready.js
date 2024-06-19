const { ActivityType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ready",
  run: async (client, message) => {
    client.manager.init(client.user.id)
    console.log(`${client.config.bot.clientName} is now online.`)
  },
};