const { EmbedBuilder } = require("discord.js");
const PlayerHandler = require("../../structures/PlayerHandler");

module.exports = async (client, player, track) => {
  channel = client.channels.cache.get(player.textChannel);

  if (player.get("autoplay")) {
    const m = await PlayerHandler.nowPlayingMessage.fetch().catch(() => {});
    if (m && m.deletable) m.delete().catch(() => {});

    return player.autoplay(player);
  } else if (player.get("stay")) {
    const m = await PlayerHandler.nowPlayingMessage.fetch().catch(() => {});
    if (m && m.deletable) m.delete().catch(() => {});

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
    const m = await PlayerHandler.nowPlayingMessage.fetch().catch(() => {});
    if (m && m.deletable) m.delete().catch(() => {});
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
