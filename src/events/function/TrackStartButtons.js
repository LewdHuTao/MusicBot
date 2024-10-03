const { EmbedBuilder } = require("discord.js");

/**
 * @param {import("../../structures/MusicBot")} client
 * @param {import("discord.js").Interaction} interaction
 */

module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {
    if (interaction.isButton()) {
      const buttonIds = [
        "previous_interaction",
        "pause_interaction",
        "skip_interaction",
        "shuffle_interaction",
        "stop_interaction"
      ];

      if (!buttonIds.includes(interaction.customId)) {
        return;
      }

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

      const buttonId = interaction.customId;

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
                `:white_check_mark: | ${interaction.member.user} used the button to skip [\`${songTitle}\`](${songUrl}).`
              ),
          ],
        });
      }

      if (buttonId === "shuffle_interaction") {
        await player.queue.shuffle();
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(
                `:white_check_mark: | ${interaction.member.user} shuffled the queue.`
              ),
          ],
        });
      }

      if (buttonId === "stop_interaction") {
        await player.disconnect();
        client.cmdDisconnect = true;

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
