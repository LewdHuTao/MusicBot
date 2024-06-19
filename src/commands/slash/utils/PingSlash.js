const SlashCommand = require("../../../structures/SlashCommand");
const ms = require("ms");

const command = new SlashCommand()
  .setName("ping")
  .setDescription("Ping-Pong.")
  .setCategory("Util")
  .setRun(async (client, interaction, options) => {
    await interaction.deferReply({ ephemeral: true });

    const uptime = `${ms(client.uptime, { long: true })}`;
    const ping = new Date().getTime() - interaction.createdTimestamp;

    interaction.editReply({
      content: `Pong 🏓 | **${client.ws.ping}ms**, ws **${ping}ms**, online for **${uptime}**`,
    });
  });

module.exports = command;