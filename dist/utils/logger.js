import config from '../config/index.js';
const logLevels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
};
const currentLogLevel = config.server.nodeEnv === 'production' ? logLevels.INFO : logLevels.DEBUG;
const formatMessage = (level, message, meta = {}) => {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaString}`;
};
const logger = {
    error: (message, meta = {}) => {
        if (currentLogLevel >= logLevels.ERROR) {
            console.error(formatMessage('ERROR', message, meta));
        }
    },
    warn: (message, meta = {}) => {
        if (currentLogLevel >= logLevels.WARN) {
            console.warn(formatMessage('WARN', message, meta));
        }
    },
    info: (message, meta = {}) => {
        if (currentLogLevel >= logLevels.INFO) {
            console.info(formatMessage('INFO', message, meta));
        }
    },
    debug: (message, meta = {}) => {
        if (currentLogLevel >= logLevels.DEBUG) {
            console.debug(formatMessage('DEBUG', message, meta));
        }
    },
};
export default logger;
