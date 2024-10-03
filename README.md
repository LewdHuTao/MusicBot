<h1 align="center">Discord Music Bot</h1>

## Features
- Built using Discord.js v14 and Lavalink v4
- Supports Slash Commands, Context Commands, and Prefix Commands
- User-friendly and easy to set up
- 24/7 Music Playback
- Customizable Prefix
- Supports Docker

## Supported Sources

![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=flat-square&logo=youtube&logoColor=white) ![SoundCloud](https://img.shields.io/badge/SoundCloud-FF3300?style=flat-square&logo=soundcloud&logoColor=white) ![Bandcamp](https://img.shields.io/badge/Bandcamp-629AA9?style=flat-square&logo=bandcamp&logoColor=white) ![Twitch](https://img.shields.io/badge/Twitch-9146FF?style=flat-square&logo=twitch&logoColor=white) ![Vimeo](https://img.shields.io/badge/Vimeo-1AB7EA?style=flat-square&logo=vimeo&logoColor=white) ![Nico](https://img.shields.io/badge/Nico-FF0066?style=flat-square&logo=nico&logoColor=white) ![HTTP](https://img.shields.io/badge/HTTP-FFA500?style=flat-square&logo=http&logoColor=white) ![Mixer](https://img.shields.io/badge/Mixer-FFA500?style=flat-square&logo=mixer&logoColor=white)

### Required Plugins

Note: If you use Lavalink Docker, LavaSrc and Youtube-Source Plugins are already installed. You just need to set up in [`lavalink/application.yml`](./lavalink/application.yml)

![Spotify](https://img.shields.io/badge/Spotify-1ED760?style=flat-square&logo=spotify&logoColor=white) ![Apple Music](https://img.shields.io/badge/Apple%20Music-000000?style=flat-square&logo=apple-music&logoColor=white) ![Deezer](https://img.shields.io/badge/Deezer-FF0000?style=flat-square&logo=deezer&logoColor=white)

## Requirements
- Node Version v18.x or higher
- Lavalink v4
- MongoDB (You can set up a free MongoDB server [here](https://www.mongodb.com/))

## Installation

You can run this bot with or without Docker. For an easy setup, use the `make` command. If `make` is not available, use `run.sh`. Ensure Docker is installed on your machine to use the bot with Docker.

Looking for a more involved guide on how to install this bot? Use the [installation guide](https://phonic.lol).


### Using Make

![Make help](./assets/make_setup.png)

### Without Make

- Before using `./run.sh`, make sure to run `chmod +x ./run.sh`.

![NoMake Help](./assets/nomake_setup.png)

#### Before you start the bot, ensure you have filled out everything in [`src/config.js`](./src/config.js).

### Command Usage (Docker)

1. **make start** or **./run.sh start**: Starts the bot with Lavalink using Docker Compose.

![Make Start](./assets/make_start.png)

2. **make start-noll** or **./run.sh start-noll**: Starts the bot without Lavalink using Docker Compose.

![Make Noll](./assets/make_startnoll.png)

3. **make restart** or **./run.sh restart**: Restarts the bot.

![Make Restart](./assets/make_restart.png)

4. **make stop** or **./run.sh stop**: Stops the bot.

![Make Stop](./assets/make_stop.png)

5. **make clean** or **./run.sh clean**: Removes Docker containers.

![Make Clean](./assets/make_clean.png)

### Command Usage (Without Docker)

1. **make start-local** or **./run.sh start local**: Starts the bot locally on your machine without Docker Compose.

Note: If you use a VPS and start the bot without Docker, make sure to use `pm2` to keep the bot online 24/7.

![Local Start](./assets/make_startlocal.png)

<br>

## Preview

![Preview 1](./assets/p1.png)
![Preview 2](./assets/p2.png)
![Preview 3](./assets/p3.png)
![Preview 4](./assets/p4.png)

## LICENSE

This project is licensed under the ISC License. You are free to use the music bot for any purpose, including making it public or verifying the bot.
