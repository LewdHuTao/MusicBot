const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { UpdateChecker } = require("../../structures/UpdateChecker");

/**
 *
 * @param {import("../../structures/MusicBot")} client
 * @param {import("discord.js").Interaction} interaction
 */

module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {
    if (
      interaction.isChatInputCommand() ||
      interaction.isContextMenuCommand()
    ) {
      if (
        !interaction.guild.members
          .resolve(client.user)
          .permissions.has(PermissionFlagsBits.SendMessages)
      ) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(
                `:x: | I don't have \`Send Message\` Permission to send message in this server`
              ),
          ],
          ephemeral: true,
        });
      }

      if (
        !interaction.guild.members
          .resolve(client.user)
          .permissions.has(PermissionFlagsBits.AttachFiles)
      ) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(
                `:x: | I don't have \`Attach Files\` Permission to send message in this server`
              ),
          ],
          ephemeral: true,
        });
      }

      if (
        !interaction.channel
          .permissionsFor(client.user)
          .has(PermissionFlagsBits.SendMessages)
      ) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(
                `:x: | I don't have \`Send Message\` Permission to send message in this server`
              ),
          ],
          ephemeral: true,
        });
      }

      if (
        !interaction.channel
          .permissionsFor(client.user)
          .has(PermissionFlagsBits.AttachFiles)
      ) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(
                `:x: | I don't have \`Attach Files\` Permission to send message in this server`
              ),
          ],
          ephemeral: true,
        });
      }

      let command;
      if (interaction.isChatInputCommand()) {
        command = client.SlashCommands.find(
          (x) => x.name == interaction.commandName
        );
      } else if (interaction.isContextMenuCommand()) {
        command = client.ContextCommands.find(
          (x) => x.command.name == interaction.commandName
        );
      }

      if (!command || !command.run)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(
                `:x: | This command is currently disabled. Please try again later.`
              ),
          ],
          ephemeral: true,
        });

      if (interaction.user.id === client.owner.userId) {
        UpdateChecker(interaction);
      }

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
    }
  },
};
