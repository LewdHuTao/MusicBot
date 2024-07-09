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

  async setNowPlayingMessage(guildId, message) {
    try {
      if (this.nowPlayingMessages.has(guildId)) {
        await this.deleteNowPlayingMessage(guildId);
      }
      this.nowPlayingMessages.set(guildId, message);
    } catch (error) {
      console.error(
        `Error setting now playing message for guild ${guildId}:`,
        error
      );
    }
  }
}

module.exports = PlayerHandler;
