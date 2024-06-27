DOCKER_COMPOSE := docker-compose

help:
	@echo "Available targets:"
	@echo "Run bot with Docker Compose:" 
	@echo "  make start           - Build and start the bot with Docker Compose"
	@echo "  make start-noll      - Build and start the bot without Lavalink with Docker Compose"
	@echo "  make restart         - Restart the bot using Docker Compose"
	@echo "  make stop            - Stop the Docker container (if running)"
	@echo "  make clean           - Remove Docker container and image"
	@echo "Run the bot without docker:"
	@echo "  make start-local     - Install dependencies and run the bot locally"

## Docker

build:
	$(DOCKER_COMPOSE) build

start: build
	$(DOCKER_COMPOSE) up -d

start-noll: build
	@echo "Starting bot without Lavalink in Docker..."
	$(DOCKER_COMPOSE) up -d --no-deps musicbot

restart:
	$(DOCKER_COMPOSE) restart

stop:
	$(DOCKER_COMPOSE) down

clean: stop
	$(DOCKER_COMPOSE) down --rmi all

## Local

start-local:
	@echo "Running bot locally..."
	@(cd src && npm install)
	@(cd src && node index.js)
