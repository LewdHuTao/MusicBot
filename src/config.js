require("dotenv").config();

module.exports = {
  bot: {
    token: process.env.token || "",
    clientName: process.env.clientName || "SomeCoolName",
    clientId: process.env.clientId || "",
    clientSecret: process.env.clientSecret || "",
  },

  owner: {
    userId: process.env.userId || "",
  },

  botSettings: {
    mongoUrl: process.env.mongoUrl || "",
    geniusToken: process.env.geniusToken || "",
    prefix: process.env.prefix || "?"
  },

  nodes: [
    {

    },
    {
        
    }
  ]
};
