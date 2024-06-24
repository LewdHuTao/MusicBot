const { presence } = require("../../config");

module.exports = {
  name: "ready",
  run: async (client, message) => {
    client.manager.init(client.user.id);
    client.user.setPresence(presence)
    client.bot.info(`${client.config.bot.clientName} is now online.`);
  },
};
