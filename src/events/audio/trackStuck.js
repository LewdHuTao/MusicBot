const { EmbedBuilder } = require("discord.js");

module.exports = async (client, player, track, payload) => {
  const channel = client.channels.cache.get(player.textChannel);
  let song = player.current.info;
  channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `:x: | Track stucked: [\`${song.title}\`](${song.uri}).`
        ),
    ],
  });
  client.node.warn(
    `Track stucked [${song.title}] in Player: ${player.guildId}`
  );
  await player.stop();
};
