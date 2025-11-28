const SlashCommand = require("../../../structures/SlashCommand");
const { EmbedBuilder, MessageFlags } = require("discord.js");
const ms = require("ms")

const command = new SlashCommand()
  .setName("seek")
  .setDescription("Seek current playing track to specific time.")
  .addStringOption((option) =>
    option
      .setName("position")
      .setDescription("Time you want to seek. ex: 2m")
      .setRequired(true)
  )
  .setCategory("Music")
  .setRun(async (client, interaction, options) => {
    const track = interaction.options.getString("position");
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

    await interaction.deferReply();

    const time = ms(track);
    const position = player.position;
    const duration = player.current.info.length;

    if (time <= duration) {
      player.seek(time);
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `:white_check_mark: | ${
                time < position ? "Rewind" : "Seeked"
              } current playing track to \`${ms(time)}\``
            ),
        ],
      });
    } else {
      return interaction
        .editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(`:x: | Invalid track duration.`),
          ],
        })
        .then(() => {
          setTimeout(() => {
            interaction.deleteReply();
          }, 5000);
        });
    }
  });

module.exports = command;
