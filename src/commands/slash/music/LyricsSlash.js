const SlashCommand = require("../../../structures/SlashCommand");
const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const { find } = require("llyrics");

const command = new SlashCommand()
  .setName("lyrics")
  .setDescription("Get lyrics of a track or current playing track.")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("Track name to search for.")
      .setRequired(false)
  )
  .setCategory("Music")
  .setRun(async (client, interaction, options) => {
    const player = client.manager.players.get(interaction.guild.id);
    const query = interaction.options.getString("query");

    if (!player && !query) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`:x: | The queue is empty.`),
        ],
        ephemeral: true,
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
      (player.current.info.title + player.current.info.author);

    if (songQuery) {
      await interaction.deferReply({ ephemeral: true });
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
      return interaction
        .editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(`:x: | No lyrics found for: \`${query}\`.`),
          ],
        })
        .then(() => {
          setTimeout(() => {
            return interaction.deleteReply();
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

    const msg = await interaction.editReply({
      embeds: [embed],
      components: [row],
    });

    const collector = msg.createMessageComponentCollector();

    collector.on("collect", async (i) => {
      if (i.customId === "next_interaction") {
        currentPage++;
        if (currentPage < pages.length) {
          const newEmbed = new EmbedBuilder()
            .setColor(client.embedColor)
            .setTitle(`${trackName} - ${trackArtist}`)
            .setThumbnail(artworkUrl)
            .setDescription(pages[currentPage])
            .setFooter({
              text: `Page: ${currentPage + 1}/${pages.length}`,
            });

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
            .setFooter({
              text: `Page: ${currentPage + 1}/${pages.length}`,
            });

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
  });

module.exports = command;
