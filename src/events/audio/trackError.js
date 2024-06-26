const { EmbedBuilder } = require("discord.js");
const PlayerHandler = require("../../structures/PlayerHandler");

module.exports = async (client, player, track, payload) => {
  const channel = client.channels.cache.get(player.textChannel);
  let song = player.current.info;
  channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor("Red")
        .setDescription(`:x: | Track error: [\`${song.title}\`](${song.uri}).`),
    ],
  });
  client.node.warn(`Track error [${song.title}] in Player: ${player.guildId}`);
  const m = await PlayerHandler.nowPlayingMessage?.fetch().catch(() => {});
  if (m && m.deletable) m.delete().catch(() => {});
  await player.stop();
};
