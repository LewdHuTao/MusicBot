const SlashCommand = require("../../../structures/SlashCommand");
const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const os = require("os");
const moment = require("moment");
require("moment-duration-format");

const command = new SlashCommand()
  .setName("stats")
  .setDescription("Get the current stats of the bot.")
  .setCategory("Util")
  .setRun(async (client, interaction, options) => {
    await interaction.deferReply({ ephemeral: true });

    const but = new ButtonBuilder()
      .setEmoji("◀️")
      .setCustomId("prev_interaction")
      .setStyle(ButtonStyle.Primary);
    const but1 = new ButtonBuilder()
      .setEmoji("▶️")
      .setCustomId("next_interaction")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents([but, but1]);
    const guild = client.guilds.cache.size;
    const user = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
    const botver = require("../../../package.json").version;
    const mem = `${(os.freemem() / 1024 / 1024).toFixed(2)}mb/${(
      os.totalmem() /
      1024 /
      1024
    ).toFixed(2)}mb`;
    const botuptime = moment
      .duration(process.uptime() * 1000)
      .format(" D [days], H [hours], m [minutes]");
    const sysuptime = moment
      .duration(os.uptime() * 1000)
      .format(" D [days], H [hours], m [minutes]");

    const embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setAuthor({
        name: `${client.user.username} Status`,
        iconURL: client.user.displayAvatarURL({ forceStatic: false }),
      })
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .addFields([
        {
          name: "Guilds",
          value: `${guild}`,
          inline: true,
        },
      ])
      .addFields([
        {
          name: "Users",
          value: `${user}`,
          inline: true,
        },
      ])
      .addFields([
        {
          name: "Info",
          value: `Version: \`v${botver}\`\nRam: \`${mem}\``,
          inline: true,
        },
      ])
      .addFields([
        {
          name: "Other",
          value: `Bot Uptime: \`${botuptime}\`\nSystem Uptime: \`${sysuptime}\``,
          inline: true,
        },
      ]);

    let msg = await interaction.editReply({
      embeds: [embed],
      components: [row],
    });

    let colors;
    const player = client.manager.players.get(interaction.guild.id);
    try {
      if (player.node.name) colors = player.node.name;
    } catch {
      if (player === undefined) colors = "Unknown";
    }

    let states;
    try {
      if (player.connect) states = "Connected";
    } catch {
      if (player === undefined) states = "Disconnected";
    }

    let all = [];

    client.manager.nodeMap.forEach((node) => {
      let color;

      if (!node.disconnect) color = "-";
      else color = "+";
      let info = [];
      info.push(
        `${color} ${node.name} => ${
          node.stats ? "Online [🟢]" : "Offline [🔴]"
        }`
      );
      all.push(info.join("\n"));
    });

    const embed1 = new EmbedBuilder()
      .setColor(client.embedColor)
      .setAuthor({
        name: "Node Status",
        iconURL: client.user.displayAvatarURL({ forceStatic: false }),
      })
      .setThumbnail(client.user.displayAvatarURL({ forceStatic: false }))
      .setFields([
        {
          name: "Audio Debug",
          value: `\`\`\`css\n
PlayerId :: ${interaction.guild.id}
Node     :: ${colors}
State    :: ${states}\`\`\``,
        },
        {
          name: "Available Node",
          value: `\`\`\`diff\n
${all.join("\n")}\`\`\``,
        },
      ]);

    const tracksCollector = msg.createMessageComponentCollector();
    tracksCollector.on("collect", async (i) => {
      try {
        if (i.customId === "prev_interaction") {
          await i.deferUpdate();
          i.editReply({
            embeds: [embed],
          });
        }
        if (i.customId === "next_interaction") {
          await i.deferUpdate();
          i.editReply({
            embeds: [embed1],
          });
        }
      } catch (err) {
        return;
      }
    });
  });

module.exports = command;
