const SlashCommand = require("../../../structures/SlashCommand");
const path = require("path");
const { EmbedBuilder, AttachmentBuilder, MessageFlags } = require("discord.js");
const { classicCard } = require("songcard");

const command = new SlashCommand()
  .setName("nowplay")
  .setDescription("Display current playing track.")
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

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    let song = player.current.info;
    let thumbnail;
    const noThumbnail = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "assets",
      "no_bg.png"
    );

    if (song.thumbnail) {
      thumbnail = song.thumbnail;
    } else {
      thumbnail = noThumbnail;
    }

    const cardImage = await classicCard({
      imageBg: thumbnail,
      imageText: song.title,
      trackStream: song.isStream,
      trackDuration: player.position,
      trackTotalDuration: song.length,
      fontPath: path.join(__dirname, "..", "..", "..", "fonts", "ArialUnicodeMS.ttf")
    });
    const attachment = new AttachmentBuilder(cardImage, {
      name: "card.png",
    });

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `**:musical_note: | Now playing:** [${song.title}](${song.uri}) [${song.requester}]`
          )
          .setImage("attachment://card.png"),
      ],
      files: [attachment],
    });
  });

module.exports = command;
