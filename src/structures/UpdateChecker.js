const config = require("../config");
const semver = require("semver");

async function UpdateChecker(ctx) {
  if (config.owner.updateChecker === true) {
    const response = await fetch(
      `https://api.github.com/repos/lewdhutao/musicbot/releases/latest`
    );
    const data = await response.json();

    const repoVersion = data.tag_name.replace("v", "");
    if (semver.gt(repoVersion, require("../package.json").version)) {
      return ctx.channel.send({
        content: `🚀 **A new version of MusicBot is available!**\n\n**Current version:** \`v${
          require("../package.json").version
        }\`\n**Latest version:** \`v${repoVersion}\`\n\nCheck out the latest release notes and download the update here: [Release ${repoVersion}](<${
          data.html_url
        }>)`,
      });
    }
  } else {
    return;
  }
}

module.exports = { UpdateChecker };
