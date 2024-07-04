const PlayerHandler = require("../../structures/PlayerHandler");

module.exports = async () => {
  const m = await PlayerHandler.nowPlayingMessage.fetch().catch(() => {});
  if (m && m.deletable) m.delete().catch(() => {});
};
