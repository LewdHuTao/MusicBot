module.exports = {
  name: "voiceStateUpdate",
  run: async (client, oldState, newState) => {
    const player = client.manager.players.get(oldState.guild.id);

    if (oldState.id === client.user.id && !newState.channel) {
      if (client.cmdDisconnect === true) {
        client.cmdDisconnect = false;
      } else {
        if (player) {
          player.disconnect();
        }
      }
    }
  },
};
