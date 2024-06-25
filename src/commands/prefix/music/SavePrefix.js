const { EmbedBuilder } = require("discord.js");
const path = require("path");

module.exports = {
  name: "save",
  category: "Music",
  description: "Save current playing track to DM.",
  args: false,
  usage: "",
  permission: [],
  aliases: ["grab"],

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

    let thumbnail;

    const prettyMS = (await import("pretty-ms")).default;
    const noThumbnail = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "assets",
      "no_bg.png"
    );

    if (player.current.info.thumbnail) {
      thumbnail = player.current.info.thumbnail;
    } else {
      thumbnail = noThumbnail;
    }

    try {
      const dm = await message.author.createDM();
      await dm.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setAuthor({
              name: "Saved song to DM",
              iconURL: message.author.displayAvatarURL({
                forceStatic: false,
              }),
            })
            .setThumbnail(thumbnail)
            .setDescription(
              `**:musical_note: | Saved [\`${player.current.info.title}\`](${player.current.info.uri}) to your DM.**`
            )
            .addFields([
              {
                name: `Song Duration`,
                value: `\`${prettyMS(player.current.info.length)}\``,
                inline: true,
              },
              {
                name: "Song Author",
                value: `\`${player.current.info.author}\``,
                inline: true,
              },
              {
                name: "Requested Guild",
                value: `\`${message.guild.name}\``,
                inline: true,
              },
            ])
            .setTimestamp(),
        ],
      });

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `:white_check_mark: | Saved [\`${player.current.info.title}\`](${player.current.info.uri}) to your DM.`
            ),
        ],
      });
    } catch (error) {
      console.log(error);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `:x: | Cannot send DM to @${message.author.username}. Make sure your DM is open.`
            ),
        ],
      });
    }
  },
};
