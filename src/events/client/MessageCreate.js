const { EmbedBuilder } = require("discord.js");
// const db = require("../util/prefixModel");

module.exports = {
  name: "messageCreate",
  run: async (client, message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    let prefix = client.settings.prefix;
    
    // Fetch prefix from database if needed
    // const ress = await db.findOne({ Guild: message.guildId });
    // if (ress && ress.Prefix) {
    //   prefix = ress.Prefix;
    //   console.log(`Custom prefix found: ${prefix}`); // Debug: Log custom prefix from database
    // }

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(mention)) {
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(
          `My prefix in this server is <@${client.user.id}>, \`${prefix}\`, \`/\` (Slash Command).`
        );
      message.channel.send({ embeds: [embed] });
      return;
    }

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );

    if (!prefixRegex.test(message.content)) return;

    const [matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    const command =
      client.PrefixCommands.get(commandName) ||
      client.PrefixCommands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;

    if (command.owner && message.author.id !== `${client.config.ownerId}`) {
      return;
    }

    try {
      command.run(message, args, client, prefix);
      client.commandRan++;
    } catch (error) {
      console.error(error);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `:x: | An error has occurred. Please check console for more details.`
            ),
        ],
      });
    }
  },
};
