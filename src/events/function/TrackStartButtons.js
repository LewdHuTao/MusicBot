const { EmbedBuilder, AttachmentBuilder, ChannelType } = require("discord.js");
const PlayerHandler = require("../../structures/PlayerHandler");

/**
 *
 * @param {import("../../structures/MusicBot")} client
 * @param {import("discord.js").Interaction}interaction
 */

module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {
    if (interaction.isButton) {
      const player = client.manager.players.get(interaction.guild.id);

      let buttonId = interaction.customId;

      if (buttonId === "previous_interaction") {
        await player.queue.add(player.previous);
        await player.stop();

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(
                `:white_check_mark: | ${interaction.member.user} used the button to enqueue [\`${player.previous.info.title}\`](${player.previous.info.uri}) by \`${player.previous.info.author}\` to the queue.`
              ),
          ],
        });
      }

      if (buttonId === "pause_interaction") {
        const isPaused = player.paused;
        await player.pause(player.playing);

        const pauseMessage = isPaused
          ? `:white_check_mark: | ${interaction.member.user} used the button to resume the current playing track.`
          : `:white_check_mark: | ${interaction.member.user} used the button to pause the current playing track.`;

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(pauseMessage),
          ],
        });
      }

      if (buttonId === "skip_interaction") {
        const songTitle = player.current.info.title;
        const songUrl = player.current.info.uri;
        await player.stop();

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(
                `:white_check_mark: | ${interaction.member.user} used the button to skipped [\`${songTitle}\`](${songUrl}).`
              ),
          ],
        });
      }
      if (buttonId === "stop_interaction") {
        await player.disconnect();

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(
                `:white_check_mark: | ${interaction.member.user} used the button to clear the queue.`
              ),
          ],
        });
      }
    }
  },
};
