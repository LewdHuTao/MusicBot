const { GatewayDispatchEvents } = require("discord.js");

module.exports = {
    name: "raw",
    run: async (client, d) => {
        if (![GatewayDispatchEvents.VoiceStateUpdate, GatewayDispatchEvents.VoiceServerUpdate,].includes(d.t)) return;
        client.manager.updateVoiceState(d);
    },
  };
  