const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    category: "Util",
    description: "Check the bot Latency.",
    args: false,
    usage: "",
    permission: [],
    aliases: ["ping", "pong", "latency"],

    run: async (message, args, client, prefix) => {

        let msg = await message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setDescription("🏓 | Fetching ping...")
                //.setColor("#6F8FAF"),
            ],
          });

    let zap = "⚡";
    let green = "🟢";
    let red = "🔴";
    let yellow = "🟡";

    var botState = zap;
    var apiState = zap;

    let apiPing = client.ws.ping;
    let botPing = Math.floor(msg.createdAt - message.createdAt);

    if (apiPing >= 40 && apiPing < 200) {
      apiState = green;
    } else if (apiPing >= 200 && apiPing < 400) {
      apiState = yellow;
    } else if (apiPing >= 400) {
      apiState = red;
    }

    if (botPing >= 40 && botPing < 200) {
      botState = green;
    } else if (botPing >= 200 && botPing < 400) {
      botState = yellow;
    } else if (botPing >= 400) {
      botState = red;
    }

    msg.delete();
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("🏓 | Pong!")
          .addFields(
            [
                {
                    name: "API Latency",
                    value: `\`\`\`yml\n${apiState} | ${apiPing}ms\`\`\``,
                },
                {
                    name: "Bot Latency",
                    value: `\`\`\`yml\n${botState} | ${botPing}ms\`\`\``,
                },
        
            ]
          )
          //.setColor(client.config.embedColor)
          .setFooter({
            text: `Requested by ${message.author.tag}`,
            iconURL: message.author.avatarURL(),
          }),
      ],
    });
  }
}