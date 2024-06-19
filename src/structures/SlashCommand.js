const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  CommandInteractionOptionResolver,
} = require("discord.js");
const MusicBot = require("./MusicBot");

class SlashCommand extends SlashCommandBuilder {
  constructor() {
    super();
    this.type = 1;
    return this;
  }
  /**
   * Set Execution of the command
   * @param {(client: MusicBot, interaction: CommandInteraction, options: CommandInteractionOptionResolver) => Promise<any>} callback
   */
  setRun(callback) {
    this.run = callback;
    return this;
  }
  setOwnerOnly() {
    this.ownerOnly = true;
    return this;
  }
  setCategory(category = "music") {
    this.category = category;
    return this;
  }
}

module.exports = SlashCommand;
