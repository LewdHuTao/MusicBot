const { EmbedBuilder } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
  name: "reload",
  category: "Developer",
  description: "Reload command for owner.",
  args: false,
  usage: "",
  permission: [],
  aliases: ["rel", "refresh"],

  run: async (message, args, client, prefix) => {
    readdirSync("./commands/slash").forEach((dir) => {
      const slashCommandFiles = readdirSync(`./commands/slash/${dir}/`).filter(
        (f) => f.endsWith(".js")
      );
      for (const file of slashCommandFiles) {
        delete require.cache[require.resolve(`./../../slash/${dir}/${file}`)];
        const command = require(`./../../slash/${dir}/${file}`);
        client.SlashCommands.set(command.name, command);
      }
    });
    readdirSync("./commands/context").forEach((dir) => {
      const contextMenuFiles = readdirSync(`./commands/context/${dir}/`).filter(
        (f) => f.endsWith(".js")
      );
      for (const file of contextMenuFiles) {
        delete require.cache[require.resolve(`./../../context/${dir}/${file}`)];
        const command = require(`./../../context/${dir}/${file}`);
        client.ContextCommands.set(file.split(".")[0], command);
      }
    });
    readdirSync("./commands/prefix").forEach((dir) => {
      const prefixCommandFiles = readdirSync(
        `./commands/prefix/${dir}/`
      ).filter((f) => f.endsWith(".js"));
      for (const file of prefixCommandFiles) {
        delete require.cache[require.resolve(`./../../prefix/${dir}/${file}`)];
        const command = require(`./../../prefix/${dir}/${file}`);
        client.PrefixCommands.set(command.name, command);
      }
    });
    const totalCommand =
      client.SlashCommands.size +
      client.ContextCommands.size +
      client.PrefixCommands.size;

    client.bot.info(
      `Successfully reloaded [${totalCommand}] Commands [Command Used By: ${message.author.tag} - Command Used In: ${message.guild.name}]`
    );

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            `:white_check_mark: | Sucessfully Reloaded **${totalCommand}** Commands`
          ),
      ],
    });
  },
};
