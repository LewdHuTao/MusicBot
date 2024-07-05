const PlayerHandler = require("../../structures/PlayerHandler");

module.exports = async () => {
  let retries = 5;
  let deleteSuccess = false;
  while (retries > 0 && !deleteSuccess) {
    try {
      const m = await PlayerHandler.nowPlayingMessage.fetch();
      if (m && m.deletable) {
        await m.delete();
        deleteSuccess = true;
      }
    } catch (error) {
      client.bot.warn(`Error deleting message: ${error.message}`);
    }
    retries--;
  }
};
