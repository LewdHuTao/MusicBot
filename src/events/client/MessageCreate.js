const { EmbedBuilder } = require("discord.js");
//const db = require("../util/prefixModel");

module.exports = {
  name: "messageCreate",
  run: async (client, message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    let prefix = client.settings.prefix;
    const channel = message?.channel;
    // const ress = await db.findOne({ Guild: message.guildId })
    // if (ress && ress.Prefix) prefix = ress.Prefix;

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(mention)) {
      const embed = new EmbedBuilder()
        //.setColor(client.config.embedColor)
        .setDescription(
          `My prefix in this server is <@${client.user.id}>, \`${prefix}\`, \`/\` (Slash Command).`
        );
      message.channel.send({ embeds: [embed] });
    }
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );
    if (!prefixRegex.test(message.content)) return;
    const [matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
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
    } catch (error) {
      console.log(error);
      embed
        .setDescription(
          "An error occured while try to run this command. Please try again"
        )
        .setColor(client.config.embedColor);
      return message.channel.send({ embeds: [embed] });
    }
  },
};
