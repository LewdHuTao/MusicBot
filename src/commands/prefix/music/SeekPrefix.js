const { EmbedBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "seek",
  category: "Music",
  description: "Seek current playing track to specific time.",
  args: true,
  usage: "<position>",
  permission: [],
  aliases: ["sk"],

  run: async (message, args, client, prefix) => {
    const track = args[0];
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

    const time = ms(track);
    const position = player.position;
    const duration = player.current.info.length;

    if (time <= duration) {
      player.seek(time);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `:white_check_mark: | ${
                time < position ? "Rewinded" : "Seeked"
              } current playing track to \`${ms(time)}\``
            ),
        ],
      });
    } else {
      return message
        .reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(`:x: | Invalid track duration.`),
          ],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete();
          }, 5000);
        });
    }
  },
};
