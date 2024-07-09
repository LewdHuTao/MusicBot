const { EmbedBuilder } = require("discord.js");
const { inspect } = require("util");

module.exports = {
  name: "eval",
  category: "Developer",
  description: "Eval command for bot owner.",
  args: true,
  usage: "<code>",
  permission: ["OWNER"],
  aliases: ["ev", "code"],

  run: async (message, args, client, prefix) => {
    const txt = args.join(" ");

    if (!txt) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(`:x: | The query is empty.`),
        ],
      });
    }

    try {
      const evaled = eval(txt);
      let ff = inspect(evaled, { depth: 0 });

      if (
        txt.includes("client.token") ||
        txt.includes("client.config.bot.token") ||
        txt.includes("process.env.token")
      ) {
        const no = new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(`:x: | Uhoh this interaction contains my token`);
        return message.reply({
          embeds: [no],
        });
      } else {
        if (String(ff).length > 2000) {
          return message.reply({
            files: [{ attachment: Buffer.from(ff), name: "output.js" }],
          });
        } else {
          return message.reply({
            content: `**📥 | Input** \n\`\`\`js\n${txt}\`\`\` \n**📤 | Output** \n\`\`\`js\n${ff}\`\`\``,
          });
        }
      }
    } catch (error) {
      return message.reply({
        content: `**📥 | Input** \n\`\`\`js\n${txt}\`\`\` \n **📤 | Error** \n\`\`\`js\n${error}\`\`\``,
      });
    }
  },
};
