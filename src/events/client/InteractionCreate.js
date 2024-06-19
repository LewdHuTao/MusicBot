const { EmbedBuilder } = require("discord.js");

/**
 *
 * @param {import("../../structures/MusicBot")} client
 * @param {import("discord.js").Interaction}interaction
 */

module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {
    if (interaction.isChatInputCommand()) {
      let command = client.SlashCommands.find(
        (x) => x.name == interaction.commandName
      );
      if (!command || !command.run)
        return client.interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(color)
              .setDescription(
                `${client.setting.crossMark} | This command are currently disabled. Please try again later.`
              ),
          ],
        });

      interaction.guild.members.fetch();
      command.run(client, interaction, interaction.options);
    //   client.commandsRan++;
      return;
    }

    if (interaction.isContextMenuCommand()) {
      let command = client.contextCommands.find(
        (x) => x.command.name == interaction.commandName
      );
      if (!command || !command.run)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(color)
              .setDescription(
                `${client.setting.crossMark} | This command are currently disabled. Please try again later.`
              ),
          ],
        });

      interaction.guild.members.fetch();
      command.run(client, interaction, interaction.options);
      client.commandsRan++;
      return;
    }
  },
};
