'use strict';

const winston = require('winston');

const util = require('util');

const { log: { prettyLoggingDepth } } = require('../config')();

const createErrorReplacer = (fieldsToIgnore = []) => ((_, value) => {
  if (value instanceof Buffer) {
    return value.toString('base64');
  }

  if (value instanceof Error) {
    return (
      Object.entries(value)
        .filter(([innerKey]) => !fieldsToIgnore.includes(innerKey))
        .reduce((acc, [innerKey, innerValue]) => ({
          ...acc,
          [innerKey]: innerValue,
        }), {})
    );
  }

  return value;
});

const prettyLoggingFormat = winston.format.printf((info) => {
  const {
    timestamp, level, message, ...args
  } = info;

  const { format } = winston;

  let depth = prettyLoggingDepth;

  let customMessage = message;

  if (args.$logOptions) {
    depth = (args.$logOptions.depth) ? args.$logOptions.depth : depth;

    if (args.$logOptions.customMessage) {
      customMessage = args.$logOptions.customMessage;
      if (customMessage !== message) {
        args.message = message || undefined;
      }
    }
  }

  delete args.$logOptions;
  delete args.requestId;

  let prettifiedMessage = ` ${customMessage}`;

  if (typeof message === 'object') {
    prettifiedMessage = util.inspect(message, {
      depth,
      compact: false,
    });
  }

  let prettifiedArgs = '';

  if (Object.keys(args).length > 0) {
    prettifiedArgs = `\n${util.inspect(JSON.parse(JSON.stringify(args, null, 4)), {
      depth,
      compact: false,
    })}`;
  }

  return format.colorize().colorize(level, `[${timestamp}]:${prettifiedMessage}${prettifiedArgs}`);
});

module.exports = {
  logger: ({ config: { log: logConfig } }) => {
    const {
      name, version, env, isPrettyLoggingEnabled, level,
    } = logConfig;

    const {
      format: {
        combine, json, prettyPrint, splat, simple, timestamp,
      },
      transports: { Console },
    } = winston;

    if (isPrettyLoggingEnabled) {
      return winston.createLogger({
        level,
        format: winston.format.combine(
          prettyPrint(),
          splat(),
          simple(),
          json({
            replacer: createErrorReplacer(['output', 'isBoom', 'isServer', 'data']),
          }),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
          prettyLoggingFormat,
        ),
        transports: [
          new Console(),
        ],
      });
    }

    return winston.createLogger({
      level,
      format: combine(
        timestamp(),
        json({
          replacer: createErrorReplacer(['output', 'isBoom', 'isServer', 'data']),
        }),
      ),
      defaultMeta: {
        name,
        version,
        env,
      },
      transports: [
        new Console(),
      ],
    });
  },
  _createErrorReplacer: createErrorReplacer,
};
