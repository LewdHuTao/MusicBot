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
              ":x: | You need to be in a voice channel to use this command."
            ),
        ],
      });
    }

    const { channel } = message.member.voice;

    if (channel.type === ChannelType.GuildStageVoice) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              ":x: | I can't join stage channel. Please use play command to play music in stage."
            ),
        ],
      });
    }

    if (message.guild.members.me.voice.channel) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`:x: | I'm already in <#${client.manager.players.get(message.guild.id).voiceChannel}>.`),
        ],
      });
    }

    await client.manager.createConnection({
      guildId: message.guild.id,
      textChannel: message.channel.id,
      voiceChannel: channel.id,
      volume: 100,
      deaf: true,
    });

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(`:white_check_mark: | Joined <#${channel.id}>.`),
      ],
    });
  },
};
