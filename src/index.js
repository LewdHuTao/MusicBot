const MusicBot = require("./structures/MusicBot");
const client = new MusicBot();

client.connect();

module.exports = client;