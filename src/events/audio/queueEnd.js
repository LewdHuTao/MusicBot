const { EmbedBuilder } = require("discord.js");

module.exports = async (client, player) => {
  const channel = client.channels.cache.get(player.textChannel);
  const guild = await client.guilds.fetch(player.guildId);

  const QueueEnd = async () => {
    await player.destroy();
    client.node.warn(
      `A player has been destroyed in guild: [${guild.name}] (${player.guildId})`
    );
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

  const message = client.playerHandler.nowPlayingMessages.get(player.guildId);
  if (message) {
    if (message.deletable) {
      await message.delete().catch(() => {});
    }
    client.playerHandler.nowPlayingMessages.delete(player.guildId);
  }

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
