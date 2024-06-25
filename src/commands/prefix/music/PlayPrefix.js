const { EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
  name: "play",
  category: "Music",
  description: "Stream music to your voice channel.",
  args: true,
  usage: "<track name>",
  permission: [],
  aliases: ["p"],

  run: async (message, args, client, prefix) => {
    const query = args.join(" ");

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

    const { channel } = message.member.voice;

    const player = await client.manager.createConnection({
      guildId: message.guild.id,
      textChannel: message.channel.id,
      voiceChannel: channel.id,
      volume: 100,
      deaf: true,
    });

    if (channel.type === ChannelType.GuildStageVoice) {
      setTimeout(() => {
        if (message.guild.members.me.voice.suppress === true) {
          try {
            message.guild.members.me.voice.setSuppressed(false);
          } catch {
            message.guild.members.me.voice.setRequestToSpeak(true);
          }
        }
      }, 2000);
    }

    const res = await client.manager.resolve({
      query: query,
      requester: message.author,
    });

    const { loadType, tracks, playlistInfo } = res;

    if (loadType === "error" || loadType === "empty") {
      player.disconnect();
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`:x: | No search results found.`),
        ],
      });
    }

    if (loadType === "search" || loadType === "track") {
      const track = tracks[0];
      await player.queue.add(track);
      if (!player.playing && !player.paused) player.play();

      if (player.queue.size < 1) return message.delete();
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `:musical_note: | Enqueued [\`${track.info.title}\`](${track.info.uri}) by \`${track.info.author}\` to the queue.`
            ),
        ],
      });
    }

    if (loadType === "playlist") {
      for (let track of res.tracks) player.queue.add(track);

      if (!player.playing && !player.paused) player.play();

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `:musical_note: | Enqueued playlist \`${playlistInfo.name}\` to the queue.`
            ),
        ],
      });
    }
  },
};
