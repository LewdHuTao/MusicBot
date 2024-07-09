const SlashCommand = require("../../../structures/SlashCommand");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require("discord.js");

const command = new SlashCommand()
  .setName("search")
  .setDescription("Search for a track.")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("Track name you want to search.")
      .setRequired(true)
  )
  .setCategory("Music")
  .setRun(async (client, interaction, options) => {
    const query = interaction.options.getString("query");
    const pms = (await import("pretty-ms")).default;
    let player = client.manager.players.get(interaction.guild.id);

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

    const searchResults = await client.manager.resolve({
      query: query,
      requester: interaction.user,
    });
    if (
      searchResults.loadType === "empty" ||
      searchResults.loadType === "error"
    ) {
      return interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`:x: | No tracks found for query \`${query}\`.`),
        ],
        ephemeral: true,
      });
    }

    const tracks = searchResults.tracks.slice(0, 10);
    const generateSearchEmbed = (start) => {
      const currentTracks = tracks.slice(start, start + 5);
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setAuthor({
          name: "Search Results",
          iconURL: interaction.guild.iconURL({ dynamic: true }),
        })
        .setDescription(
          currentTracks
            .map(
              (track, index) =>
                `\`${start + index + 1}.\` \`(${pms(track.info.length, {
                  secondsDecimalDigits: 0,
                })})\` [${track.info.title}](${track.info.uri}) - \`${
                  track.info.author
                }\``
            )
            .join("\n")
        )
        .setFooter({
          text: `Page ${Math.floor(start / 5) + 1} of ${Math.ceil(
            tracks.length / 5
          )}`,
        });

      return embed;
    };

    let currentIndex = 0;
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("prev")
        .setEmoji("◀️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(currentIndex === 0),
      new ButtonBuilder()
        .setCustomId("next")
        .setEmoji("▶️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(tracks.length <= 5)
    );

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("select")
        .setPlaceholder("Select a track")
        .addOptions(
          tracks.map((track, index) => ({
            label: track.info.title,
            description: track.info.author,
            value: index.toString(),
          }))
        )
    );

    const message = await interaction.followUp({
      embeds: [generateSearchEmbed(currentIndex)],
      components: [menu, row],
    });

    const collector = message.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "prev") {
        currentIndex -= 5;
      } else if (i.customId === "next") {
        currentIndex += 5;
      } else if (i.customId === "select") {
        const trackIndex = parseInt(i.values[0]);
        const track = tracks[trackIndex];

        if (!player) {
          const { channel } = interaction.member.voice;

          player = client.manager.createConnection({
            guildId: interaction.guild.id,
            textChannel: interaction.channel.id,
            voiceChannel: channel.id,
            volume: 100,
            deaf: true,
          });
        }

        await player.queue.add(track);
        if (!player.playing && !player.paused) player.play();

        await i.update({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(
                `:white_check_mark: | [${track.info.title}](${track.info.uri}) added to the queue!`
              ),
          ],
          components: [],
        });
        return;
      }

      await i.update({
        embeds: [generateSearchEmbed(currentIndex)],
        components: [
          menu,
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("prev")
              .setEmoji("◀️")
              .setStyle(ButtonStyle.Primary)
              .setDisabled(currentIndex === 0),
            new ButtonBuilder()
              .setCustomId("next")
              .setEmoji("▶️")
              .setStyle(ButtonStyle.Primary)
              .setDisabled(currentIndex + 5 >= tracks.length)
          ),
        ],
      });
    });

    collector.on("end", async () => {
      if (!message) return;
      await message.edit({
        components: [],
      });
    });
  });

module.exports = command;
