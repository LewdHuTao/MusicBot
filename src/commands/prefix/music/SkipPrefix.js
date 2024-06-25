const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "skip",
  category: "Music",
  description: "Skip current playing track.",
  args: false,
  usage: "",
  permission: [],
  aliases: ["next", "s"],

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

    if (!player.queue || !player.queue.length || !player.queue.length === 0) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `:x: | Add more track to the queue to use this command.`
            ),
        ],
      });
    }

    let songTitle;
    let songUrl;

    songTitle = player.current.info.title;
    songUrl = player.current.info.uri;

    await player.stop();

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `:white_check_mark: | Skipped [\`${songTitle}\`](${songUrl}).`
          ),
      ],
    });
  },
};
