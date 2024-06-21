const SlashCommand = require("../../../structures/SlashCommand");
const { EmbedBuilder } = require("discord.js");
const { inspect } = require("util");

const command = new SlashCommand()
  .setName("eval")
  .setDescription("Eval command for bot owner.")
  .addStringOption((option) =>
    option
      .setName("code")
      .setDescription("Code you want to eval")
      .setRequired(true)
  )
  .setCategory("Developer")
  .setOwnerOnly(true)
  .setRun(async (client, interaction, options) => {
    const txt = interaction.options.getString("code");

    await interaction.deferReply({ ephemeral: true });

    try {
      const evaled = eval(txt);
      let ff = inspect(evaled, { depth: 0 });
      if (
        txt.includes("client.token") ||
        txt.includes("client.config.bot.token") ||
        txt.includes("process.env.token")
      ) {
        const no = new EmbedBuilder()
          .setColor(color)
          .setDescription(
            `${client.e.crossMark} | Uhoh this interaction is contained my token`
          );
        return interaction.editReply({
          embeds: [no],
        });
      } else {
        await interaction.editReply({
          content: `**📥 | Input** \n\`\`\`js\n${txt}\`\`\` \n**📤 | Output** \n\`\`\`js\n${ff}\`\`\``,
        });
      }
      if (String(ff).length > 2000)
        ff = await interaction.editReply({
          files: [{ attachment: Buffer.from(ff), name: "output.js" }],
        });
    } catch (error) {
      return interaction.editReply({
        content: `**📥 | Input** \n\`\`\`js\n${txt}\`\`\` \n **📤 | Error** \n\`\`\`js\n${error}\`\`\``,
      });
    }
  });

module.exports = command;
