const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "loopqueue",
  category: "Music",
  description: "Loop the queue.",
  args: false,
  usage: "",
  permission: [],
  aliases: ["lq"],

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

    if (player.loop === "queue") {
      await player.setLoop("none");

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`:white_check_mark: | Loop mode set to \`none\`.`),
        ],
      });
    }

    await player.setLoop("queue");

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(`:white_check_mark: | Loop mode set to \`queue\`.`),
      ],
    });
  },
};
