const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");


module.exports = {
  name: "queue",
  category: "Music",
  description: "Show upcoming track in the queue.",
  args: false,
  usage: "",
  permission: [],
  aliases: ["q"],

  run: async (message, args, client, prefix) => {
    const player = client.manager.players.get(message.guild.id);
    const pms = (await import("pretty-ms")).default;

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

    const generateQueueEmbed = (start) => {
      const currentQueue = player.queue.slice(start, start + 10);
      const queueDescription = currentQueue
        .map(
          (track, index) =>
            `\`${start + index + 1}.\` \`(${pms(track.info.length, {
              secondsDecimalDigits: 0,
            })})\` ${track.info.title} - [${track.info.requester}]`
        )
        .join("\n");

      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setAuthor({
          name: "Current Music Queue",
          iconURL: message.guild.iconURL({ forceStatic: false }),
        })
        .setThumbnail(player.current.info.thumbnail)
        .addFields([
          {
            name: "Now Playing",
            value: `[\`${player.current.info.title}\`](${player.current.info.uri}) by \`${player.current.info.author}\` [${player.current.info.requester}]`,
          },
          {
            name: "Queued Track(s)",
            value:
              queueDescription.length > 1024
                ? queueDescription.substring(0, 1021) + "..."
                : queueDescription || "No more tracks in queue.",
          },
        ])
        .setFooter({
          text: `Page ${Math.floor(start / 10) + 1} of ${Math.max(
            1,
            Math.ceil(player.queue.length / 10)
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
        .setDisabled(player.queue.length <= 10)
    );

    const msg = await message.reply({
      embeds: [generateQueueEmbed(currentIndex)],
      components: [row],
    });

    const collector = msg.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
      time: 120000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "prev") {
        currentIndex -= 10;
      } else if (i.customId === "next") {
        currentIndex += 10;
      }

      await i.update({
        embeds: [generateQueueEmbed(currentIndex)],
        components: [
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
              .setDisabled(currentIndex + 10 >= player.queue.length)
          ),
        ],
      });
    });

    collector.on("end", async () => {
      if (!msg) return;
      await msg.edit({
        components: [],
      });
    });
  },
};
