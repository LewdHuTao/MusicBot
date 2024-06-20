const { ActivityType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ready",
  run: async (client, message) => {
    client.manager.init(client.user.id)
    client.bot.info(`${client.config.bot.clientName} is now online.`)
  },
};