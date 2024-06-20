const colors = require("colors");
const fs = require('fs');
const path = require('path');

const LOG_LEVELS = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
};

class LoggerService {
  constructor() {
    this.loggers = {};
    this.currentLogLevel = LOG_LEVELS.INFO;
  }

  setLogLevel(level) {
    if (LOG_LEVELS[level.toUpperCase()]) {
      this.currentLogLevel = level.toLowerCase();
    } else {
      console.error(`${colors.red('[ERROR]')} - Invalid log level: ${level}`);
    }
  }

  createLogger(clientName) {
    if (!this.loggers[clientName]) {
      this.loggers[clientName] = {
        info: (message) => this.logMessage(clientName, LOG_LEVELS.INFO, colors.blue, message),
        warn: (message) => this.logMessage(clientName, LOG_LEVELS.WARN, colors.yellow, message),
        error: (message) => this.logMessage(clientName, LOG_LEVELS.ERROR, colors.red, message),
      };
    }
    return this.loggers[clientName];
  }

  logMessage(clientName, level, colorFunc, message) {
    if (Object.values(LOG_LEVELS).indexOf(this.currentLogLevel) <= Object.values(LOG_LEVELS).indexOf(level)) {
      const formattedMessage = `${colors.gray(currentDate())} - ${colors.magenta(`[${clientName.toUpperCase()}]`)} - ${colorFunc(`[${level.toUpperCase()}]`)} - ${colorFunc(message)}`;
      console.log(formattedMessage);
      this.writeLogToFile(formattedMessage);
    }
  }

  writeLogToFile(message) {
    const logFilePath = path.join(__dirname, 'logs.txt');
    fs.appendFileSync(logFilePath, message + '\n', (err) => {
      if (err) console.error(`${colors.red('[ERROR]')} - Failed to write log to file: ${err.message}`);
    });
  }
}

const currentDate = () => {
  return new Date().toLocaleString().replace(/:\d{2} /, " ");
};

module.exports = new LoggerService();
