const { dynamicCard } = require("songcard");
const {
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
} = require("discord.js");
const path = require("path");
const PlayerHandler = require("../../structures/PlayerHandler");

module.exports = async (client, player, track) => {
  let thumbnail;

  const noThumbnail = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "assets",
    "no_bg.png"
  );

  if (track.info.thumbnail) {
    thumbnail = track.info.thumbnail;
  } else {
    thumbnail = noThumbnail;
  }

  const user = await client.users.fetch(track.info.requester);
  const username = `@${user.username}` || null;

  const trackPlayCanvas = await dynamicCard({
    thumbnailURL: thumbnail,
    songTitle: track.info.title,
    songArtist: track.info.author,
    streamProvider: track.info.sourceName,
    trackRequester: username,
  });

  const attachment = new AttachmentBuilder(trackPlayCanvas, {
    name: "trackPlayCanvas.png",
  });

  const but = new ButtonBuilder()
    .setCustomId("previous_interaction")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(!player.previous)
    .setEmoji("⏮️");

  const but1 = new ButtonBuilder()
    .setCustomId("pause_interaction")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("⏸️");

  const but2 = new ButtonBuilder()
    .setCustomId("skip_interaction")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("⏭️");

  const but3 = new ButtonBuilder()
    .setCustomId("stop_interaction")
    .setStyle(ButtonStyle.Danger)
    .setEmoji("⏹️");

  const row = new ActionRowBuilder().addComponents([but, but1, but2, but3]);

  let message;

  message = await client.channels.cache
    .get(player.textChannel)
    .send({ files: [attachment], components: [row] });

  client.node.info(
    `Track has been started playing [${track.info.title}] in Player: ${player.guildId}`
  );
  client.musicPlay++;
  PlayerHandler.nowPlayingMessage = message;

  const collecter = message.createMessageComponentCollector({
    time: track.current,
  });

  collecter.on("collect", async (i) => {
    let player = client.manager.players.get(i.guild.id);
    if (i.customId === "pause_interaction") {
      if (player.paused === false) {
        but1.setEmoji("⏸️");
        message.edit({
          components: [row],
        });
      } else {
        but1.setEmoji("▶️");
        message.edit({
          components: [row],
        });
      }
    }
  });
};
