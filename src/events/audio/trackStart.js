const { dynamicCard } = require("songcard")

module.exports = async (client, player, track) => {
    const channel = await client.channels.cache.get(player.textChannel);

  channel.send(
    `Now Playing: [${track.info.title}](${track.info.uri}) [${track.info.requester}]`
  );
}