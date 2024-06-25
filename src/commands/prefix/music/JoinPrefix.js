const { EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
  name: "join",
  category: "Music",
  description: "Let the bot join voice channel.",
  args: false,
  usage: "",
  permission: [],
  aliases: [],

  run: async (message, args, client, prefix) => {
    if (!message.member.voice.channel) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `:x: | You need to be in a voice channel to use this command.`
            ),
        ],
      });
    }

    if (
      message.guild.members.me.voice.channel &&
      !message.guild.members.me.voice.channel.equals(
        message.member.voice.channel
      )
    ) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `:x: | You need to be in the same voice channel as the bot to use this command.`
            ),
        ],
      });
    }

    const { channel } = message.member.voice;

      await client.manager.createConnection({
        guildId: message.guild.id,
        textChannel: message.channel.id,
        voiceChannel: channel.id,
        volume: 100,
        deaf: true,
      });

      if (channel.type === ChannelType.GuildStageVoice) {
        setTimeout(() => {
          if (message.guild.members.me.voice.suppress == true) {
            try {
              message.guild.members.me.voice.setSuppressed(false);
            } catch (e) {
              message.guild.members.me.voice.setRequestToSpeak(true);
            }
          }
        }, 2000);
      }

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `:white_check_mark: | Joined <#${channel.id}>.`
            ),
        ],
      });
  },
};
