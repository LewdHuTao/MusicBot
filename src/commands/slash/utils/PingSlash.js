const SlashCommand = require("../../../structures/SlashCommand");
const { EmbedBuilder } = require("discord.js");

const command = new SlashCommand()
  .setName("ping")
  .setDescription("Ping-Pong.")
  .setCategory("Util")
  .setRun(async (client, interaction, options) => {
    await interaction.deferReply({ ephemeral: true });

    let zap = "⚡";
    let green = "🟢";
    let red = "🔴";
    let yellow = "🟡";

    var botState = zap;
    var apiState = zap;

    let apiPing = client.ws.ping;
    let botPing = Math.floor(
      new Date().getTime() - interaction.createdTimestamp
    );

    if (apiPing >= 40 && apiPing < 200) {
      apiState = green;
    } else if (apiPing >= 200 && apiPing < 400) {
      apiState = yellow;
    } else if (apiPing >= 400) {
      apiState = red;
    }

    if (botPing >= 40 && botPing < 200) {
      botState = green;
    } else if (botPing >= 200 && botPing < 400) {
      botState = yellow;
    } else if (botPing >= 400) {
      botState = red;
    }

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("🏓 | Pong!")
          .addFields([
            {
              name: "API Latency",
              value: `\`\`\`yml\n${apiState} | ${apiPing}ms\`\`\``,
            },
            {
              name: "Bot Latency",
              value: `\`\`\`yml\n${botState} | ${botPing}ms\`\`\``,
            },
          ])
          .setColor(client.embedColor)
          .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.avatarURL(),
          }),
      ],
    });
  });

module.exports = command;
