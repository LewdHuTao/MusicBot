const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
} = require("discord.js");
const SlashCommand = require("../../../structures/SlashCommand");

const command = new SlashCommand()
  .setName("help")
  .setDescription("Show a list of available commands.")
  .addStringOption((option) =>
    option
      .setName("command")
      .setDescription("Get more details about a specific command.")
      .setRequired(false)
      .setAutocomplete(true)
  )
  .setCategory("Util")
  .setRun(async (client, interaction) => {
    const commandName = interaction.options.getString("command");

    await interaction.deferReply({ ephemeral: true });

    const categories = {};
    client.SlashCommands.forEach((cmd) => {
      if (!categories[cmd.category]) {
        categories[cmd.category] = [];
      }
      categories[cmd.category].push({
        name: cmd.name,
        description: cmd.description,
      });
    });

    if (commandName) {
      const command = Object.values(categories)
        .flat()
        .find((cmd) => cmd.name === commandName);
      if (!command) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(`:x: | No command found.`),
          ],
        });
      }

      const embed = new EmbedBuilder()
        .setTitle(`Command: ${command.name}`)
        .setDescription(command.description)
        .setColor(client.embedColor);

      return interaction.editReply({ embeds: [embed] });
    }

    const categoryOptions = Object.keys(categories).map((category) => ({
      label: category,
      value: category,
    }));

    categoryOptions.unshift({
      label: "Overview",
      value: "overview",
    });

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("help_menu")
      .setPlaceholder("Select a category")
      .addOptions(categoryOptions);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const overviewDescription = Object.entries(categories)
      .map(([category, commands]) => {
        const commandNames = commands
          .map((cmd) => `\`${cmd.name}\``)
          .join(", ");
        return `**${category} Commands**\n${commandNames}`;
      })
      .join("\n\n");

    const overviewEmbed = new EmbedBuilder()
      .setAuthor({
        name: `❯ ${client.user.username} slash-command(s) list`,
        iconURL: client.user.displayAvatarURL({ forceStatic: false }),
      })
      .setThumbnail(client.user.displayAvatarURL({ forceStatic: false }))
      .setDescription(overviewDescription)
      .setColor(client.embedColor);

    await interaction.editReply({ embeds: [overviewEmbed], components: [row] });

    const filter = (i) =>
      i.customId === "help_menu" && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      const category = i.values[0];
      if (category === "overview") {
        return i.editReply({ embeds: [overviewEmbed], components: [row] }).catch(() => {});
      } else {
        const commands = categories[category]
          .map((cmd) => `\`${cmd.name}\` - ${cmd.description}`)
          .join("\n");

        const categoryEmbed = new EmbedBuilder()
          .setAuthor({
            name: `❯ ${client.user.username} slash-command(s) list`,
            iconURL: client.user.displayAvatarURL({ forceStatic: false }),
          })
          .setThumbnail(client.user.displayAvatarURL({ forceStatic: false }))
          .setDescription(commands)
          .setColor(client.embedColor);

        return i.editReply({ embeds: [categoryEmbed], components: [row] }).catch(() => {});
      }
    });

    collector.on("end", (collected, reason) => {
      if (reason === 'time') {
        const disabledRow = new ActionRowBuilder().addComponents(selectMenu.setDisabled(true));
        return interaction.editReply({ components: [disabledRow] });
      }
    });
  });

module.exports = command;
