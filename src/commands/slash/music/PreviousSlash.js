const SlashCommand = require("../../../structures/SlashCommand");
const { EmbedBuilder } = require("discord.js");

const command = new SlashCommand()
  .setName("previous")
  .setDescription("Play previous track on the queue.")
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

    if (!player.previous) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`:x: | No previous track found on queue.`),
        ],
      });
    }

    await player.queue.add(player.previous);
    await player.stop();

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `:white_check_mark: | Enqueued [\`${player.previous.info.title}\`](${player.previous.info.uri}) by \`${player.previous.info.author}\` to the queue.`
          ),
      ],
    });
  });

module.exports = command;
