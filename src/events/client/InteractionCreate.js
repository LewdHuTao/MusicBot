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
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(color)
              .setDescription(
                `${client.setting.crossMark} | This command are currently disabled. Please try again later.`
              ),
          ],
          ephemeral: true,
        });

      if (command.ownerOnly === true) {
        if (interaction.user.id !== client.owner.userId) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                  `:x: | You're not the owner. Only the owner can use this command.`
                ),
            ],
            ephemeral: true,
          });
        }
      }

      command.run(client, interaction, interaction.options);
      client.commandRan++;
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
          ephemeral: true,
        });

      interaction.guild.members.fetch();
      command.run(client, interaction, interaction.options);
      client.commandsRan++;
      return;
    }
  },
};
