#!/bin/bash

DOCKER_COMPOSE="docker-compose"
SRC_DIR="src"
MAIN_FILE="index.js"

help() {
    echo "Available targets:"
    echo "Run bot with Docker Compose:"
    echo "  ./run.sh start           - Build and start the bot with Docker Compose"
    echo "  ./run.sh start-noll      - Build and start the bot without Lavalink with Docker Compose"
    echo "  ./run.sh restart         - Restart the bot using Docker Compose"
    echo "  ./run.sh stop            - Stop the Docker container (if running)"
    echo "  ./run.sh clean           - Remove Docker container and image"
    echo "Run the bot without Docker:"
    echo "  ./run.sh start-local     - Install dependencies and run the bot locally"
}

build() {
    $DOCKER_COMPOSE build
}

start() {
    build
    $DOCKER_COMPOSE up -d
}

start-noll() {
    build
    $DOCKER_COMPOSE up -d --no-deps musicbot
}

restart() {
    $DOCKER_COMPOSE restart
}

stop() {
    $DOCKER_COMPOSE down
}

clean() {
    stop
    $DOCKER_COMPOSE down --rmi all
}

start-local() {
    echo "Running bot locally..."
    (cd $SRC_DIR && npm install)
    (cd $SRC_DIR && node $MAIN_FILE)
}

case "$1" in
    help)
        help
        ;;
    start)
        start
        ;;
    start-noll)
        start-noll
        ;;
    restart)
        restart
        ;;
    stop)
        stop
        ;;
    clean)
        clean
        ;;
    start-local)
        start-local
        ;;
    *)
        echo "Invalid command. See available targets with './run.sh help'"
        exit 1
        ;;
esac

exit 0
