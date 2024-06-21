const SlashCommand = require("../../../structures/SlashCommand");
const { EmbedBuilder } = require("discord.js");

const command = new SlashCommand()
  .setName("volume")
  .setDescription("Set new volume for the player.")
  .addIntegerOption((option) =>
    option
      .setName("scale")
      .setDescription("Time you want to seek. ex: 2m")
      .setRequired(true)
  )
  .setCategory("Music")
  .setRun(async (client, interaction, options) => {
    const scale = interaction.options.getInteger("scale");
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

    if (!scale) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `:musical_note: | Player volume is set to: **${player.volume}**`
            ),
        ],
      });
    } else {
      await player.setVolume(Number(scale));

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `:white_check_mark: | Player volume is now set to: **${scale}**`
            ),
        ],
      });
    }
  });

module.exports = command;
