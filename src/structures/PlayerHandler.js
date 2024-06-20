const {
    Guild,
    TextChannel,
    User,
    Message,
    ButtonInteraction,
  } = require("discord.js");
  const { Player } = require("niizuki");
  const { EventEmitter } = require("events");
  const { MusicBot } = require("./MusicBot");
  
  class PlayerHandler extends EventEmitter {
    /**
     *
     * @param {MusicBot} client
     * @param {Guild} guild
     * @param {TextChannel} channel
     * @param {Player} player
     * @param {User} user
     * @param {ButtonInteraction} interaction
     */
    constructor(client, guild, channel, player, user, interaction) {
      super();
      /**
       * @type {MusicBot}
       */
      this.client = client;
      /**
       * @type {Guild}
       */
      this.guild = guild;
      /**
       * @type {TextChannel}
       */
      this.channel = channel;
      /**
       * @type {Player}
       */
      this.player = player;
      /**
       * @type {ButtonInteraction}
       */
      this.interaction = interaction;
      /**
       * @type {Message}
       */
      this.nowPlayingMessage = null;
    }
    async deleteNowPlayingMessage() {
      if (this.nowPlayingMessage) {
        await this.nowPlayingMessage.delete().catch(() => {
          undefined;
        });
        this.nowPlayingMessage = null;
      }
    }
  }
  
  module.exports = PlayerHandler;