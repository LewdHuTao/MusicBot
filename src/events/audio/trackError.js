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
  client.node.warn(`Track error [${song.title}] in Player: ${player.guildId}`);
  await player.stop();

  let retries = 3;
  let deleteSuccess = false;
  while (retries > 0 && !deleteSuccess) {
    try {
      const m = await PlayerHandler.nowPlayingMessage.fetch();
      if (m && m.deletable) {
        await m.delete();
        deleteSuccess = true;
      }
    } catch (error) {
      client.bot.warn(`Error deleting message: ${error.message}`);
    }
    retries--;
  }
};
