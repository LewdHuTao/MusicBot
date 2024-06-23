module.exports = {
    name: "interactionCreate",
    run: async (client, interaction) => {
      if (!interaction.isAutocomplete()) return;
  
      try {
        if (interaction.commandName === "help") {
          const searchQuery = interaction.options.getString("command")?.toLowerCase();
  
          const allCommands = await client.application.commands.fetch();
  
          let filteredCommands;
  
          if (!searchQuery) {
            filteredCommands = allCommands
              .map((command) => {
                const category = client.SlashCommands.get(command.name)?.category;
                if (!category) return null;
                return {
                  name: command.name,
                  value: command.name,
                };
              })
              .filter(Boolean)
              .sort((a, b) => a.name.localeCompare(b.name))
              .slice(0, 24);
          } else {
            filteredCommands = allCommands
              .filter((command) => {
                const category = client.SlashCommands.get(command.name)?.category;
                if (!category) return false;
                return command.name.toLowerCase().includes(searchQuery);
              })
              .map((cmd) => ({
                name: cmd.name,
                value: cmd.name,
              }))
              .sort((a, b) => a.name.localeCompare(b.name))
              .slice(0, 24);
          }
  
          await interaction.respond(filteredCommands).catch(() => {});
        }
      } catch {
        return;
      }
    },
  };
  