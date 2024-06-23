const { REGEX } = require("../../utils/LinkRegex");
const yt = require("youtube-sr").default;
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {
    if (!interaction.isAutocomplete()) return;

    const pms = (await import("pretty-ms")).default;

    try {
      if (interaction.commandName === "play") {
        const searchQuery = interaction.options.getString("query");

        if (!searchQuery) {
          const responseChoices = [
            {
              name: "🔎 Please provide a query.",
              value: "https://youtube.com/null",
            },
          ];
          await interaction.respond(responseChoices).catch(() => {});
          return;
        }

        const cachedResults = cache.get(searchQuery);
        if (cachedResults) {
          await interaction.respond(cachedResults).catch(() => {});
          return;
        }

        const match = REGEX.some((regex) => regex.test(searchQuery));
        if (match) {
          const responseChoices = [
            { name: `🎵 ${searchQuery}`, value: searchQuery },
          ];
          cache.set(searchQuery, responseChoices);
          await interaction.respond(responseChoices).catch(() => {});
          return;
        }

        const Random = "ytsearch"[
          Math.floor(Math.random() * "ytsearch".length)
        ];
        const responseChoices = [];
        const result = await yt.search(searchQuery || Random, {
          safeSearch: false,
          limit: 10,
        });

        if (
          result.loadType === "LOAD_FAILED" ||
          result.loadType === "NO_MATCHES"
        ) {
          console.error("No matches found.");
        } else {
          result.forEach((x, index) => {
            const title = `🎵 ${x.title} - ${pms(x.duration)}`;
            const truncatedTitle =
              title.length > 100 ? title.substring(0, 97) + "..." : title;

            responseChoices.push({
              name: truncatedTitle,
              value: x.url,
            });
          });
        }

        cache.set(searchQuery, responseChoices);

        await interaction.respond(responseChoices).catch(() => {});
      }
    } catch {
      return;
    }
  },
};
