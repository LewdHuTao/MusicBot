const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "move",
  category: "Music",
  description: "Move track to different position in queue.",
  args: true,
  usage: "<track> <position>",
  permission: [],
  aliases: ["mv"],

  run: async (message, args, client, prefix) => {
    const track = args[0];
    const position = args[1];
    const player = client.manager.players.get(message.guild.id);

    if (isNaN(track) || isNaN(position)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`:x: | Invalid value.`),
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

    const trackNum = Number(track) - 1;
    if (trackNum < 0 || trackNum > player.queue.length - 1) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`:x: | Invalid track number.`),
        ],
      });
    }

    let dest = Number(position) - 1;
    if (dest < 0 || dest > player.queue.length - 1) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`:x: | Invalid position number.`),
        ],
      });
    }

    const thing = player.queue[trackNum];
    player.queue.splice(trackNum, 1);
    player.queue.splice(dest, 0, thing);
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `:white_check_mark: | Moved track \`${track}\` to position \`${position}\`.`
          ),
      ],
    });
  },
};
