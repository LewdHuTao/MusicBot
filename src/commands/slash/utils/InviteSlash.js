const SlashCommand = require("../../../structures/SlashCommand");

const command = new SlashCommand()
  .setName("invite")
  .setDescription("Invite me to your server.")
  .setCategory("Util")
  .setRun(async (client, interaction, options) => {
    await interaction.deferReply({ ephemeral: true });

    return interaction.editReply({
      content: `[Invite me to your server now!](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=277062150416&scope=bot%20applications.commands)`,
    });
  });

module.exports = command;
