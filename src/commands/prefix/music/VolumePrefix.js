const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "volume",
  category: "Music",
  description: "Set new volume for the player.",
  args: true,
  usage: "<scale>",
  permission: [],
  aliases: ["vol"],

  run: async (message, args, client, prefix) => {
    const scale = parseInt(args[0]);
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

    if (!scale) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `:musical_note: | Player volume is set to: **${player.volume}**`
            ),
        ],
      });
    } else {
      if (isNaN(scale)) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(`:x: | Volume must be a valid number.`),
          ],
        });
      }

      await player.setVolume(scale);

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `:white_check_mark: | Player volume is now set to: **${scale}**`
            ),
        ],
      });
    }
  },
};
