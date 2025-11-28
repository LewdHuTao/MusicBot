const SlashCommand = require("../../../structures/SlashCommand");
const { EmbedBuilder, ChannelType, MessageFlags } = require("discord.js");

const command = new SlashCommand()
  .setName("join")
  .setDescription("Let the bot join voice channel.")
  .setCategory("Music")
  .setRun(async (client, interaction, options) => {
    if (!interaction.member.voice.channel) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `:x: | You need to be in a voice channel to use this command.`
            ),
        ],
        flags: MessageFlags.Ephemeral,
      });
    }

    await interaction.deferReply();

    const { channel } = interaction.member.voice;

    if (channel.type === ChannelType.GuildStageVoice) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              ":x: | I can't join stage channel. Please use play command to play music in stage."
            ),
        ],
      });
    }

    if (interaction.guild.members.me.voice.channel) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`:x: | I'm already in <#${client.manager.players.get(interaction.guild.id).voiceChannel}>.`),
        ],
      });
    }

    await client.manager.createConnection({
      guildId: interaction.guild.id,
      textChannel: interaction.channel.id,
      voiceChannel: channel.id,
      volume: 100,
      deaf: true,
    });

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(`:white_check_mark: | Joined <#${channel.id}>.`),
      ],
    });
  });

module.exports = command;
