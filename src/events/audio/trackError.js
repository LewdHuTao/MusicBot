const { EmbedBuilder } = require("discord.js");

module.exports = async (client, player) => {
  const channel = client.channels.cache.get(player.textChannel);
  let song = player.current.info;
  channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor("Red")
        .setDescription(`:x: | Track error: [\`${song.title}\`](${song.uri}).`),
    ],
  });
  const guild = await client.guilds.fetch(player.guildId);
  client.node.warn(
    `Track error [${song.title}] in Player: [${guild.name}] (${player.guildId})`
  );
  await player.stop();

  console.log(client.playerHandler.nowPlayingMessages.get(player.guildId));
  const message = client.playerHandler.nowPlayingMessages.get(player.guildId);
  if (message) {
    if (message.deletable) {
      await message.delete().catch(() => {});
    }
    client.playerHandler.nowPlayingMessages.delete(player.guildId);
  }
};
