const { EmbedBuilder } = require("discord.js");
const PlayerHandler = require("../../structures/PlayerHandler");

module.exports = async (client, player) => {
  const channel = client.channels.cache.get(player.textChannel);
  const guild = await client.guilds.fetch(player.guildId);

  const QueueEnd = async () => {
    await player.destroy();
    client.node.warn(`A player has been destroyed in guild: [${guild.name}] (${player.guildId})`);
    return channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `:musical_note: | Destroyed the player and leaves <#${player.voiceChannel}>`
          ),
      ],
    });
  };

  const m = await PlayerHandler.nowPlayingMessage.fetch().catch(() => {});
  if (m && m.deletable) m.delete().catch(() => {});

  if (!player.connected) {
    return await QueueEnd();
  }

  if (player.get("autoplay")) {
    await player.autoplay(player);
  } else if (player.get("stay")) {
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
    await QueueEnd();
  }
};
