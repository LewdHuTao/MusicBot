const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "247",
  category: "Music",
  description: "Set 24/7 mode to the player.",
  args: false,
  usage: "",
  permission: [],
  aliases: ["stay", "24-7"],

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

    const stay = player.get("stay");
    player.set("stay", !stay);

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `:white_check_mark: | 24/7 mode has been ${
              stay ? "disabled" : "enabled"
            }.`
          ),
      ],
    });
  },
};
