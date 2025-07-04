import config from '../config/index.js';

type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';

const logLevels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
} as const;

const currentLogLevel = config.server.nodeEnv === 'production' ? logLevels.INFO : logLevels.DEBUG;

const formatMessage = (
    level: LogLevel,
    message: string,
    meta: Record<string, unknown> = {}
): string => {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaString}`;
};

const logger = {
    error: (message: string, meta: Record<string, unknown> = {}) => {
        if (currentLogLevel >= logLevels.ERROR) {
            console.error(formatMessage('ERROR', message, meta));
        }
    },
    warn: (message: string, meta: Record<string, unknown> = {}) => {
        if (currentLogLevel >= logLevels.WARN) {
            console.warn(formatMessage('WARN', message, meta));
        }
    },
    info: (message: string, meta: Record<string, unknown> = {}) => {
        if (currentLogLevel >= logLevels.INFO) {
            console.info(formatMessage('INFO', message, meta));
        }
    },
    debug: (message: string, meta: Record<string, unknown> = {}) => {
        if (currentLogLevel >= logLevels.DEBUG) {
            console.debug(formatMessage('DEBUG', message, meta));
        }
    },
};

export default logger;
