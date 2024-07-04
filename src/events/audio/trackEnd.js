const PlayerHandler = require("../../structures/PlayerHandler");

module.exports = async () => {
  PlayerHandler.deleteMessageWithRetries(PlayerHandler.nowPlayingMessage);
};
