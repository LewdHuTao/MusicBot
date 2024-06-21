const SlashCommand = require("../../../structures/SlashCommand");
const { EmbedBuilder, ChannelType } = require("discord.js");

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
        ephemeral: true,
      });
    }

    if (
      interaction.guild.members.me.voice.channel &&
      !interaction.guild.members.me.voice.channel.equals(
        interaction.member.voice.channel
      )
    ) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `:x: | You need to be in the same voice channel as the bot to use this command.`
            ),
        ],
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    const { channel } = interaction.member.voice;

      await client.manager.createConnection({
        guildId: interaction.guild.id,
        textChannel: interaction.channel.id,
        voiceChannel: channel.id,
        volume: 100,
        deaf: true,
      });

      if (channel.type === ChannelType.GuildStageVoice) {
        setTimeout(() => {
          if (interaction.guild.members.me.voice.suppress == true) {
            try {
              interaction.guild.members.me.voice.setSuppressed(false);
            } catch (e) {
              interaction.guild.members.me.voice.setRequestToSpeak(true);
            }
          }
        }, 2000);
      }

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `:white_check_mark: | Joined <#${channel.id}>.`
            ),
        ],
      });
  });

module.exports = command;
