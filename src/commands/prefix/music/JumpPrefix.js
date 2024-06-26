const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "jump",
  category: "Music",
  description: "Skip to specific song in queue.",
  args: true,
  usage: "<position>",
  permission: [],
  aliases: ["skipto"],

  run: async (message, args, client, prefix) => {
    const position = args[0];
    const player = client.manager.players.get(message.guild.id);

    if (isNaN(position)) {
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

    const number = Number(position);

    if (!number || number < 1 || number > player.queue.size) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`:x: | Track not found.`),
        ],
      });
    }

    try {
      player.queue.splice(0, number - 1);
      player.stop();
    } catch {
      if (number === 1) {
        player.stop();
      }
    }

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `:white_check_mark: | Stopped current track and skipped to track **${number}**`
          ),
      ],
    });
  },
};
