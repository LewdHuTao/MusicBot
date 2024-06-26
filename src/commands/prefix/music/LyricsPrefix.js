const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const { find } = require("llyrics");

module.exports = {
  name: "lyrics",
  category: "Music",
  description: "Get lyrics of a track or current playing track.",
  args: false,
  usage: "[track name]",
  permission: [],
  aliases: ["ly"],

  run: async (message, args, client, prefix) => {
    const player = client.manager.players.get(message.guild.id);
    const query = args.join(" ");

    if (!player && !query) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`:x: | The queue is empty.`),
        ],
      });
    }

    function splitText(text, maxChunkLength) {
      const chunks = [];
      for (let i = 0; i < text.length; i += maxChunkLength) {
        chunks.push(text.slice(i, i + maxChunkLength));
      }
      return chunks;
    }

    let lyrics, trackName, trackArtist, artworkUrl;

    let songQuery =
      query ||
      (player && player.current.info.title + player.current.info.author);

    if (songQuery) {
      try {
        const searchOptions = {
          song: songQuery,
          forceSearch: true,
        };

        if (client.settings.geniusToken) {
          searchOptions.geniusApiKey = client.settings.geniusToken;
        }

        const lyricsData = await find(searchOptions);

        if (lyricsData && lyricsData.lyrics) {
          lyrics = lyricsData.lyrics;
          trackName = lyricsData.title;
          trackArtist = lyricsData.artist;
          artworkUrl = lyricsData.artworkURL;
        }
      } catch (error) {
        console.log(
          `Failed to fetch lyrics from ${Object.keys(searchEngine).find(
            (key) => searchEngine[key]
          )}`,
          error
        );
      }
    }

    if (!lyrics) {
      return message
        .reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(`:x: | No lyrics found for: \`${query}\`.`),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            return msg.delete();
          }, 5000);
        });
    }

    const pageLength = 2000;
    const pages = splitText(lyrics, pageLength);

    let currentPage = 0;

    const embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setTitle(`${trackName} - ${trackArtist}`)
      .setThumbnail(artworkUrl)
      .setDescription(pages[currentPage])
      .setFooter({ text: `Page: ${currentPage + 1}/${pages.length}` });

    const but1 = new ButtonBuilder()
      .setCustomId("prev_interaction")
      .setEmoji("◀️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(currentPage === 0);

    const but2 = new ButtonBuilder()
      .setCustomId("next_interaction")
      .setEmoji("▶️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(currentPage === pages.length - 1);

    const row = new ActionRowBuilder().addComponents(but1, but2);

    const msg = await message.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true,
    });

    const filter = (i) =>
      i.customId === "prev_interaction" || i.customId === "next_interaction";
    const collector = msg.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "next_interaction") {
        currentPage++;
        if (currentPage < pages.length) {
          const newEmbed = new EmbedBuilder()
            .setColor(client.embedColor)
            .setTitle(`${trackName} - ${trackArtist}`)
            .setThumbnail(artworkUrl)
            .setDescription(pages[currentPage])
            .setFooter({ text: `Page: ${currentPage + 1}/${pages.length}` });

          const newBut1 = new ButtonBuilder()
            .setCustomId("prev_interaction")
            .setEmoji("◀️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === 0);

          const newBut2 = new ButtonBuilder()
            .setCustomId("next_interaction")
            .setEmoji("▶️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === pages.length - 1);

          const newRow = new ActionRowBuilder().addComponents(newBut1, newBut2);

          await i.update({
            embeds: [newEmbed],
            components: [newRow],
          });
        }
      } else if (i.customId === "prev_interaction") {
        currentPage--;
        if (currentPage >= 0) {
          const newEmbed = new EmbedBuilder()
            .setColor(client.embedColor)
            .setTitle(`${trackName} - ${trackArtist}`)
            .setThumbnail(artworkUrl)
            .setDescription(pages[currentPage])
            .setFooter({ text: `Page: ${currentPage + 1}/${pages.length}` });

          const newBut1 = new ButtonBuilder()
            .setCustomId("prev_interaction")
            .setEmoji("◀️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === 0);

          const newBut2 = new ButtonBuilder()
            .setCustomId("next_interaction")
            .setEmoji("▶️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === pages.length - 1);

          const newRow = new ActionRowBuilder().addComponents(newBut1, newBut2);

          await i.update({
            embeds: [newEmbed],
            components: [newRow],
          });
        }
      }
    });

    collector.on("end", () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        but1.setDisabled(true),
        but2.setDisabled(true)
      );
      msg.edit({ components: [disabledRow] });
    });
  },
};
