const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ChannelType,
} = require("discord.js");

module.exports = {
  name: "search",
  category: "Music",
  description: "Search for a track.",
  args: true,
  usage: "<query>",
  permission: [],
  aliases: ["srch"],

  run: async (message, args, client, prefix) => {
    const query = args.join(" ");
    const pms = (await import("pretty-ms")).default;
    let player = client.manager.players.get(message.guild.id);

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

    const searchResults = await client.manager.resolve({
      query: query,
      requester: message.author,
    });

    if (
      searchResults.loadType === "empty" ||
      searchResults.loadType === "error"
    ) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`:x: | No tracks found for query \`${query}\`.`),
        ],
      });
    }

    const tracks = searchResults.tracks.slice(0, 10);
    const generateSearchEmbed = (start) => {
      const currentTracks = tracks.slice(start, start + 5);
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setAuthor({
          name: "Search Results",
          iconURL: message.guild.iconURL({ dynamic: true }),
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

    const messageReply = await message.reply({
      embeds: [generateSearchEmbed(currentIndex)],
      components: [menu, row],
    });

    const collector = messageReply.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
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
          const { channel } = message.member.voice;

          player = client.manager.createConnection({
            guildId: message.guild.id,
            textChannel: message.channel.id,
            voiceChannel: channel.id,
            volume: 100,
            deaf: true,
          });

          if (channel.type === ChannelType.GuildStageVoice) {
            setTimeout(() => {
              if (message.guild.members.me.voice.suppress === true) {
                try {
                  message.guild.members.me.voice.setSuppressed(false);
                } catch {
                  message.guild.members.me.voice.setRequestToSpeak(true);
                }
              }
            }, 2000);
          }
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
      if (!messageReply) return;
      await messageReply.edit({
        components: [],
      });
    });
  },
};
