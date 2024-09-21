const path = require("path");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { classicCard } = require("songcard");

module.exports = {
  name: "nowplay",
  category: "Music",
  description: "Display current playing track.",
  args: false,
  usage: "",
  permission: [],
  aliases: ["np", "nowplaying"],

  run: async (message, args, client, prefix) => {
    const player = client.manager.players.get(message.guild.id);

    if (!player) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`:x: | The queue is empty.`),
        ],
      });
    }

    if (!message.member.voice.channel) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `:x: | You need to be in a voice channel to use this command.`
            ),
        ],
      });
    }

    if (
      message.guild.members.me.voice.channel &&
      !message.guild.members.me.voice.channel.equals(
        message.member.voice.channel
      )
    ) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `:x: | You need to be in the same voice channel as the bot to use this command.`
            ),
        ],
      });
    }

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
    })

    return message.reply({
      embeds: [
        new EmbedBuilder()
        .setColor(client.embedColor)
      .setDescription(
        `**:musical_note: | Now playing:** [${song.title}](${song.uri}) [${song.requester}]`
      )
    .setImage("attachment://card.png")
      ],
      files: [attachment],
    });
  },
};
