const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "help",
  category: "Util",
  description: "Show a list of available commands.",
  args: false,
  usage: "[command name]",
  permission: [],
  aliases: ["h", "commands"],

  run: async (message, args, client, prefix) => {
    const commandName = args[0];

    const categories = {};
    client.PrefixCommands.forEach((cmd) => {
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
        return message.reply({
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

      return message.reply({ embeds: [embed] });
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
        name: `❯ ${client.user.username} command(s) list`,
        iconURL: client.user.displayAvatarURL({ forceStatic: false }),
      })
      .setThumbnail(client.user.displayAvatarURL({ forceStatic: false }))
      .setDescription(overviewDescription)
      .setColor(client.embedColor);

    const msg = await message.reply({
      embeds: [overviewEmbed],
      components: [row],
      fetchReply: true,
    });

    const filter = (i) => i.customId === "help_menu" && i.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({
      filter,
      time: 60000, 
    });

    collector.on("collect", async (i) => {
      const category = i.values[0];

      if (category === "overview") {
        await i.update({ embeds: [overviewEmbed], components: [row] }).catch((error) => {
          console.error('Failed to update interaction:', error);
        });
      } else {
        const commands = categories[category]
          .map((cmd) => `\`${cmd.name}\` - ${cmd.description}`)
          .join("\n");

        const categoryEmbed = new EmbedBuilder()
          .setAuthor({
            name: `❯ ${client.user.username} command(s) list`,
            iconURL: client.user.displayAvatarURL({ forceStatic: false }),
          })
          .setThumbnail(client.user.displayAvatarURL({ forceStatic: false }))
          .setDescription(commands)
          .setColor(client.embedColor);

        await i.update({ embeds: [categoryEmbed], components: [row] }).catch((error) => {
          console.error('Failed to update interaction:', error);
        });
      }
    });

    collector.on("end", (collected, reason) => {
      if (reason === 'time') {
        const disabledRow = new ActionRowBuilder().addComponents(selectMenu.setDisabled(true));
        msg.edit({ components: [disabledRow] }).catch((error) => {
          console.error('Failed to disable menu:', error);
        });
      }
    });
  },
};
