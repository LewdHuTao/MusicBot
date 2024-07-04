const PlayerHandler = require("../../structures/PlayerHandler");

module.exports = async () => {
  await PlayerHandler.deleteMessageWithRetries(PlayerHandler.nowPlayingMessage);
};
