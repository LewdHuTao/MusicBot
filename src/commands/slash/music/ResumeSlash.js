const SlashCommand = require("../../../structures/SlashCommand");
const { EmbedBuilder, MessageFlags } = require("discord.js");

const command = new SlashCommand()
  .setName("resume")
  .setDescription("Resume current playing track.")
  .setCategory("Music")
  .setRun(async (client, interaction, options) => {
    const player = client.manager.players.get(interaction.guild.id);

    if (!player) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`:x: | The queue is empty.`),
        ],
        flags: MessageFlags.Ephemeral,
      });
    }

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
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!player.paused) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription(
              `:x: | The current track is already resumed.`
            )
        ],
        flags: MessageFlags.Ephemeral,
      })
    }

    await interaction.deferReply();

    await player.pause(false);
    let song = player.current;

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `:white_check_mark: | Resumed playing: [\`${song.info.title}\`](${song.info.uri})`
          ),
      ],
    });
  });

module.exports = command;
