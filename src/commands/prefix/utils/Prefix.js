const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const schema = require("../../../models/PrefixSchema");

module.exports = {
  name: "prefix",
  category: "Util",
  description: "Change prefix settings.",
  args: false,
  usage: "",
  permission: [],
  aliases: [],

  run: async (message, args, client, prefix) => {
    const prefixArgs = args[0];

    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `:x: | You don't have \`Manage Guild\` Permissions to use this command.`
            ),
        ],
      });
    }

    if (prefixArgs) {
      const Schema = await schema.findOne({
        guildId: message.guild.id,
      });

      if (!Schema) {
        schema.create({ guildId: message.guild.id, prefix: prefixArgs });
      } else {
        Schema.guildId = message.guild.id;
        Schema.prefix = prefixArgs;

        await Schema.save();
      }

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `:white_check_mark: | Prefix for this guild has been set to: \`${prefixArgs}\`.`
            ),
        ],
      });
    } else {
      let prefixData;

      const PrefixSchema = await schema.findOne({
        guildId: message.guild.id,
      });

      if (PrefixSchema) {
        prefixData = PrefixSchema.prefix;
      } else {
        prefixData = client.settings.prefix;
      }

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(
              `:gear: | Prefix for this server is set to: \`${prefixData}\`.`
            ),
        ],
      });
    }
  },
};
