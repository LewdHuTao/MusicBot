const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "disconnect",
  category: "Music",
  description: "Leaves the voice channel and clears the queue.",
  args: false,
  usage: "",
  permission: [],
  aliases: ["dc", "stop"],

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

    await player.disconnect();
    client.cmdDisconnect = true;

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `:white_check_mark: | Leaves <#${message.guild.members.me.voice.channel.id}> and clears the queue.`
          ),
      ],
    });
  },
};
