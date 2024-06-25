const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "autoplay",
  category: "Music",
  description: "Set autoplay mode to the player and auto queue songs.",
  args: false,
  usage: "",
  permission: [],
  aliases: ["ap", "autoqueue"],

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

    const autoplayEnabled = player.get("autoplay");
    player.set("autoplay", !autoplayEnabled);

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `:white_check_mark: | Autoplay mode has been ${
              autoplayEnabled ? "disabled" : "enabled"
            }.`
          ),
      ],
    });
  },
};
