const { EmbedBuilder } = require("discord.js");
const os = require("os");
const si = require("systeminformation");
const mongoose = require("mongoose");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  name: "stats",
  category: "Util",
  description: "See latest bot status.",
  args: false,
  usage: "",
  permission: [],
  aliases: ["status", "info"],

  run: async (message, args, client, prefix) => {
    const duration = moment
      .duration(process.uptime() * 1000)
      .format(" D [days], H [hours], m [minutes]");
    const cpu = await si.cpu();
    const uptime = moment
      .duration(os.uptime() * 1000)
      .format(" D [days], H [hours], m [minutes]");
    const start = Date.now();

    await mongoose.connection.db.admin().ping();

    const end = Date.now();
    const ping1 = end - start;

    return message.reply({
      embeds: [
        new EmbedBuilder().setColor(client.embedColor).addFields([
          {
            name: `${client.user.username} Status:`,

            value:
              "```ml\n• Bot Ver        :: " +
              require("../../../package.json").version +
              "\n• Discord.JS Ver :: " +
              require("discord.js").version +
              "\n• Node.JS Ver    :: " +
              process.version +
              "\n• Guild          :: " +
              client.guilds.cache.size +
              " Guild(s)\n• Channel        :: " +
              client.channels.cache.size +
              " Channel(s)\n• User           :: " +
              client.guilds.cache.reduce((a, g) => a + g.memberCount, 0) +
              " User(s) " +
              "\n• Command Ran    :: " +
              client.commandRan +
              "\n• Music Played   :: " +
              client.musicPlay +
              "```",
          },
          {
            name: "System Status:",

            value:
              "```ml\n• Platform       :: " +
              os.type +
              `(${os.machine()})` +
              "\n• Processor      :: " +
              os.cpus()[0].model +
              "\n• Speed          :: " +
              os.cpus()[0].speed +
              "MHz\n• Core           :: " +
              cpu.cores +
              " Core(s)\n• System Uptime  :: " +
              uptime +
              "\n• Bot Uptime     :: " +
              duration +
              "\n• Bot Ping       :: " +
              `${client.ws.ping}ms` +
              "\n• Database Ping  :: " +
              `${ping1}ms` +
              "```",
          },
          {
            name: "Memory Status:",

            value:
              "```ml\n• Total Memory   :: " +
              (os.totalmem() / 1024 / 1024).toFixed(2) +
              "mb\n• Free Memory    :: " +
              (os.freemem() / 1024 / 1024).toFixed(2) +
              "mb\n• Heap Total     :: " +
              (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2) +
              "mb\n• Heap Usage     :: " +
              (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) +
              "mb```",
          },
        ]),
      ],
    });
  },
};
