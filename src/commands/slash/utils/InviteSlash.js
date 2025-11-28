const SlashCommand = require("../../../structures/SlashCommand");
const { MessageFlags } = require("discord.js");

const command = new SlashCommand()
  .setName("invite")
  .setDescription("Invite me to your server.")
  .setCategory("Util")
  .setRun(async (client, interaction, options) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    return interaction.editReply({
      content: `[Invite me to your server now!](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=281357117712&scope=bot%20applications.commands)`,
    });
  });

module.exports = command;
