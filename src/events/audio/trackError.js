const { EmbedBuilder } = require("discord.js");
const PlayerHandler = require("../../structures/PlayerHandler");

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
  client.node.warn(`Track error [${song.title}] in Player: [${guild.name}] (${player.guildId})`);
  await player.stop();
};
