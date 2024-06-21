const path = require("path");
const SlashCommand = require("../../../structures/SlashCommand");
const { EmbedBuilder } = require("discord.js");

const command = new SlashCommand()
  .setName("save")
  .setDescription("Save current playing track to DM.")
  .setCategory("Music")
  .setRun(async (client, interaction, options) => {
    const player = client.manager.players.get(interaction.guild.id);

    if (!player) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`:x: | The queue is empty.`),
        ],
        ephemeral: true,
      });
    }

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

    await interaction.deferReply({ ephemeral: true });

    let thumbnail;

    const prettyMS = (await import("pretty-ms")).default;
    const noThumbnail = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "assets",
      "no_bg.png"
    );

    if (player.current.info.thumbnail) {
      thumbnail = player.current.info.thumbnail;
    } else {
      thumbnail = noThumbnail;
    }

    try {
      const dm = await interaction.user.createDM();
      await dm.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setAuthor({
              name: "Saved song to DM",
              iconURL: interaction.user.displayAvatarURL({
                forceStatic: false,
              }),
            })
            .setThumbnail(thumbnail)
            .setDescription(
              `**:musical_note: | Saved [\`${player.current.info.title}\`](${player.current.info.uri}) to your DM.**`
            )
            .addFields([
              {
                name: `Song Duration`,
                value: `\`${prettyMS(player.current.info.length)}\``,
                inline: true,
              },
              {
                name: "Song Author",
                value: `\`${player.current.info.author}\``,
                inline: true,
              },
              {
                name: "Requested Guild",
                value: `\`${interaction.guild.name}\``,
                inline: true,
              },
            ])
            .setTimestamp(),
        ],
      });
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `:white_check_mark: | Saved [\`${player.current.info.title}\`](${player.current.info.uri}) to your DM.`
            ),
        ],
      });
    } catch (error) {
      console.log(error);
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `:x: | Cannot send DM to @${interaction.user.username}. Make sure your DM is open.`
            ),
        ],
      });
    }
  });

module.exports = command;
