const { EventEmitter } = require("events");

class PlayerHandler extends EventEmitter {
  constructor(client) {
    super();
    this.client = client;
    this.nowPlayingMessages = new Map();
  }

  async deleteNowPlayingMessage(guildId) {
    const message = this.nowPlayingMessages.get(guildId);
    if (message) {
      await message.delete().catch(() => {
        undefined;
      });
      this.nowPlayingMessages.delete(guildId);
    }
  }

  setNowPlayingMessage(guildId, message) {
    this.nowPlayingMessages.set(guildId, message);
  }
}

module.exports = PlayerHandler;
