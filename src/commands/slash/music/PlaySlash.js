const SlashCommand = require("../../../structures/SlashCommand");
const { EmbedBuilder } = require("discord.js");

const command = new SlashCommand()
  .setName("play")
  .setDescription("Stream music to your voice channel.")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("Track to search!")
      .setRequired(true)
      .setAutocomplete(true)
  )
  .setCategory("Music")
  .setRun(async (client, interaction, options) => {
    const query = interaction.options.getString("query");

    if (!interaction.member.voice.channel) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `:x: | You need to be in a voice channel to use this command.`
            ),
        ],
        ephemeral: true,
      });
    }

    if (
      interaction.guild.members.me.voice.channel &&
      !interaction.guild.members.me.voice.channel.equals(
        interaction.member.voice.channel
      )
    ) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `:x: | You need to be in the same voice channel as the bot to use this command.`
            ),
        ],
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    const { channel } = interaction.member.voice;

    const player = await client.manager.createConnection({
      guildId: interaction.guild.id,
      textChannel: interaction.channel.id,
      voiceChannel: channel.id,
      volume: 100,
      deaf: true,
    });

    const res = await client.manager.resolve({
      query: query,
      requester: interaction.user,
    });

    const { loadType, tracks, playlistInfo } = res;

    if (loadType === "error" || loadType === "empty") {
      if (player.current === null) {
        player.disconnect();
        client.cmdDisconnect = true;
      }
      return interaction.editReply({
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

      if (player.queue.size < 1) return interaction.deleteReply();
      return interaction.editReply({
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

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `:musical_note: | Enqueued playlist \`${playlistInfo.name}\` to the queue.`
            ),
        ],
      });
    }
  });

module.exports = command;
