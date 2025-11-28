const SlashCommand = require("../../../structures/SlashCommand");
const { EmbedBuilder, MessageFlags } = require("discord.js");

const command = new SlashCommand()
  .setName("loop")
  .setDescription("Change player loop mode.")
  .addStringOption((option) =>
    option
      .setName("option")
      .setDescription("Choose loop options.")
      .setRequired(true)
      .addChoices(
        {
          name: "Loop Track - Set Loop Mode to current playing track.",
          value: "track",
        },
        {
          name: "Loop Queue - Set Loop Mode to the whole queue.",
          value: "queue",
        },
        {
          name: "Loop Off - Off Loop Mode.",
          value: "none",
        }
      )
  )
  .setCategory("Music")
  .setRun(async (client, interaction, options) => {
    const player = client.manager.players.get(interaction.guild.id);
    const category = interaction.options.getString("option");

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

    player.setLoop(category);

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `:white_check_mark: | Loop mode set to \`${category}\`.`
          ),
      ],
    });
  });

module.exports = command;
