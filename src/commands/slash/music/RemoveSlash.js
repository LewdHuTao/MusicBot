const SlashCommand = require("../../../structures/SlashCommand");
const { EmbedBuilder } = require("discord.js");

const command = new SlashCommand()
  .setName("remove")
  .setDescription("Remove track from queue.")
  .addIntegerOption((option) =>
    option
      .setName("track")
      .setDescription("Track you want to remove.")
      .setRequired(true)
  )
  .setCategory("Music")
  .setRun(async (client, interaction, options) => {
    const track = interaction.options.getInteger("track");
    const player = client.manager.players.get(interaction.guild.id);

    if (!player) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`:x: | The queue is empty.`),
        ],
        ephemeral: true,
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

    const position = Number(track) - 1;
    if (position > player.queue.size) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `:x: | Queue has only \`${player.queue.size}\` track queued.`
            ),
        ],
      });
    }

    const song = player.queue[position];
    player.queue.remove(position);

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `:white_check_mark: | Removed [\`${song.info.title}\`](${song.info.uri}) from queue.`
          ),
      ],
    });
  });

module.exports = command;
