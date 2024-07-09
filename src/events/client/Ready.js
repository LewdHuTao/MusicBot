const { presence } = require("../../config");
const PlayerHandler = require("../../structures/PlayerHandler");

module.exports = {
  name: "ready",
  run: async (client, message) => {
    client.manager.init(client.user.id);
    client.playerHandler = new PlayerHandler(client);
    client.user.setPresence(presence);
    client.bot.info(`${client.config.bot.clientName} is now online.`);
  },
};
