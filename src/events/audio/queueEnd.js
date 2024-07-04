const { EmbedBuilder } = require("discord.js");
const PlayerHandler = require("../../structures/PlayerHandler");

module.exports = async (client, player) => {
  channel = client.channels.cache.get(player.textChannel);

  if (player.get("autoplay")) {
    PlayerHandler.deleteMessageWithRetries(PlayerHandler.nowPlayingMessage);

    return player.autoplay(player);
  } else if (player.get("stay")) {
    PlayerHandler.deleteMessageWithRetries(PlayerHandler.nowPlayingMessage);

    channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `:musical_note: | Queue ended, please enqueue new track!`
          ),
      ],
    });
  } else {
    PlayerHandler.deleteMessageWithRetries(PlayerHandler.nowPlayingMessage);

    await player.destroy();
    client.node.warn(`A player has been destroyed in guild: ${player.guildId}`);

    return channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `:musical_note: | Destroyed the player and leaves <#${player.voiceChannel}>`
          ),
      ],
    });
  }
};
