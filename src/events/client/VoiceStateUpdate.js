const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
let requestSend = false;

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

    if (
      newState.id === client.user.id &&
      newState.channelId &&
      newState.channel.type === ChannelType.GuildStageVoice &&
      newState.guild.members.me.voice.suppress
    ) {
      const stageChannel = newState.guild.channels.cache.get(
        newState.channelId
      );
      const botMember = newState.guild.members.me;
      const permissions = stageChannel.permissionsFor(botMember);

      if (
        permissions.has(PermissionFlagsBits.Connect) &&
        permissions.has(PermissionFlagsBits.Speak)
      ) {
        setTimeout(async () => {
          try {
            await botMember.voice.setSuppressed(false);
            if (player && player.paused) {
              player.pause(false);
            }
            requestSend = false;
          } catch (error) {
            await botMember.voice.setRequestToSpeak(true);
            if (player) {
              player.pause(true);
            }

            if (!requestSend) {
              client.channels.cache.get(player.textChannel).send({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.embedColor)
                    .setDescription(
                      `:musical_note: | A request has been sent to be a speaker in stage.`
                    ),
                ],
              });
              requestSend = true;
            }
          }
        }, 2000);
      } else {
        client.bot.error(
          "Bot does not have required permissions in stage channel."
        );
      }
    }

    if (
      newState.id === client.user.id &&
      newState.channelId &&
      newState.channel.type === ChannelType.GuildStageVoice &&
      !newState.guild.members.me.voice.suppress
    ) {
      if (player && player.paused) {
        player.pause(false);
      }
      requestSend = false;
    }
  },
};
