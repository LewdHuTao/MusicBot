const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "remove",
  category: "Music",
  description: "Remove track from queue.",
  args: true,
  usage: "<track number>",
  permission: [],
  aliases: ["rm"],

  run: async (message, args, client, prefix) => {
    const track = args[0];
    const player = client.manager.players.get(message.guild.id);

    if (isNaN(track)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`:x: | Track number must be a valid number.`),
        ],
      });
    }

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

    const position = Number(track) - 1;
    if (position >= player.queue.size || position < 0) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `:x: | Queue has only \`${player.queue.size}\` tracks queued.`
            ),
        ],
      });
    }

    const song = player.queue[position];
    player.queue.remove(position);

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `:white_check_mark: | Removed [\`${song.info.title}\`](${song.info.uri}) from queue.`
          ),
      ],
    });
  },
};
