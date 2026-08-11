import winston from 'winston';
import { env } from './env.js';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define transports
const transports: winston.transport[] = [
  // Console transport for all logs
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
      )
    ),
  }),
];

// Add file transport for production (only if we can write to logs directory)
// In Docker/containerized environments like Render, we often don't have write permissions
// So we disable file logging and rely on console logging which gets captured by the platform
const enableFileLogging = env.nodeEnv === 'production' && process.env.ENABLE_FILE_LOGGING === 'true';

if (enableFileLogging) {
  try {
    const fs = require('fs');
    // Try to create logs directory and check if we have write permissions
    if (!fs.existsSync('logs')) {
      fs.mkdirSync('logs', { recursive: true });
    }
    // Test write permissions
    fs.accessSync('logs', fs.constants.W_OK);

    transports.push(
      // Error log file
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format,
      }),
      // Combined log file
      new winston.transports.File({
        filename: 'logs/combined.log',
        format,
      })
    );
  } catch (error) {
    // If we can't write to logs directory, skip file logging
    // Console logging will still work
    console.log('File logging disabled: no write permission for logs directory');
  }
}

// Create logger instance
export const logger = winston.createLogger({
  level: env.nodeEnv === 'production' ? 'info' : 'debug',
  levels,
  format,
  transports,
  // Handle exceptions and rejections using console only
  // File logging is disabled in containerized environments like Render
  exceptionHandlers: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
        )
      ),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
        )
      ),
    }),
  ],
});

// Create stream for Morgan HTTP logger
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};
