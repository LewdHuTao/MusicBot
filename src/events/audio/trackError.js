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
};
