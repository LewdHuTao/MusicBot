module.exports = async (client, player) => {
  const message = client.playerHandler.nowPlayingMessages.get(player.guildId);
  if (message) {
    if (message.deletable) {
      await message.delete().catch(() => {});
    }
    client.playerHandler.nowPlayingMessages.delete(player.guildId);
  }
};
