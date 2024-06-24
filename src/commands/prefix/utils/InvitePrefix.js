module.exports = {
  name: "invite",
  category: "Util",
  description: "Invite me to your server.",
  args: false,
  usage: "",
  permission: [],
  aliases: ["inv", "add"],

  run: async (message, args, client, prefix) => {
    return message.reply({
      content: `[Invite me to your server now!](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=277062150416&scope=bot%20applications.commands)`,
    });
  },
};
