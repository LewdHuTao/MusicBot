const SlashCommand = require("../../../structures/SlashCommand");
const path = require("path");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
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

    await interaction.deferReply({ ephemeral: true });

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
    });
    const attachment = new AttachmentBuilder(cardImage, {
      name: "card.png",
    });

    let nowPlayEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(
        `**:musical_note: | Now playing:** [${song.title}](${song.uri}) [${song.requester}]`
      )
      .setImage("attachment://card.png");

    return interaction.editReply({
      embeds: [nowPlayEmbed],
      files: [attachment],
    });
  });

module.exports = command;
