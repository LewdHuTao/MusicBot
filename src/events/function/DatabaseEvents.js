const mongoose = require("mongoose");

module.exports = {
  name: "clientReady",
  run: async (client, message) => {
    mongoose.connect(client.settings.mongoUrl);
    mongoose.Promise = global.Promise;
    mongoose.set("strictQuery", true);
    mongoose.connection.on("connected", () => {
      client.bot.info(
        "Database connection connected. MongoDB is ready.",
        "ready"
      );
    });
    mongoose.connection.on("err", (err) => {
      client.bot.error(
        `Database connection error. MongoDB-01 is not ready.`,
        "error"
      );
    });
    mongoose.connection.on("disconnected", () => {
      client.bot.warn(
        "Database connection disconnected. MongoDB-01 is disconnected."
      );
    });
  },
};
