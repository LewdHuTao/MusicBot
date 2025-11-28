const SlashCommand = require("../../../structures/SlashCommand");
const { EmbedBuilder, MessageFlags } = require("discord.js");

const command = new SlashCommand()
  .setName("move")
  .setDescription("Move track to different position in queue.")
  .addIntegerOption((option) =>
    option
      .setName("track")
      .setDescription("Track number you want to move.")
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("position")
      .setDescription("New position number for the track.")
      .setRequired(true)
  )
  .setCategory("Music")
  .setRun(async (client, interaction, options) => {
    const track = interaction.options.getInteger("track");
    const position = interaction.options.getInteger("position");
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

    const trackNum = Number(track) - 1;
    if (trackNum < 0 || trackNum > player.queue.length - 1) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`:x: | Invalid track number.`),
        ],
      });
    }

    let dest = Number(position) - 1;
    if (dest < 0 || dest > player.queue.length - 1) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`:x: | Invalid position number.`),
        ],
      });
    }

    const thing = player.queue[trackNum];
    player.queue.splice(trackNum, 1);
    player.queue.splice(dest, 0, thing);
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `:white_check_mark: | Moved track \`${track}\` to position \`${position}\`.`
          ),
      ],
    });
  });

module.exports = command;
