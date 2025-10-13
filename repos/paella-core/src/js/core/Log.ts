/* eslint-disable no-console */

import type Paella from "../Paella.js"

/**
 * Log level constants with TypeScript support and JavaScript compatibility
 */
export const LOG_LEVEL = Object.freeze({
    DISABLED: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    DEBUG: 4,
    VERBOSE: 5
} as const);

/**
 * Type representing log level values
 */
export type LogLevelValue = typeof LOG_LEVEL[keyof typeof LOG_LEVEL];

/**
 * Type representing log level names
 */
export type LogLevelName = keyof typeof LOG_LEVEL;

/**
 * Union type for log levels - accepts both string names and numeric values
 */
export type LogLevel = LogLevelName | LogLevelValue;

import Events, { triggerEvent } from "./Events";

let g_globalLogLevel: LogLevelValue = LOG_LEVEL.INFO;

export const setLogLevel = (l: LogLevel, player: Paella | null = null) => {
    const level = typeof(l) === "string" ? LOG_LEVEL[l.toUpperCase() as LogLevelName] : l;

    if (level < LOG_LEVEL.DISABLED || level > LOG_LEVEL.VERBOSE) {
        throw Error(`setLogLevel: invalid log level ${ level }`);
    }
    if (player) {
        (player as any).__logSettings = (player as any).__logSettings || {};
        (player as any).__logSettings.logLevel = level;
    }
    else {
        g_globalLogLevel = level;
    }
}

export const currentLogLevel = (player: Paella | null = null): LogLevelValue => {
    return player ? (player as any).__logSettings?.logLevel || g_globalLogLevel : g_globalLogLevel;
}

interface PrintMessageParams {
    msg: string;
    level?: LogLevelValue;
    player?: Paella | null;
    context?: string;
}

export const printMessage = ({
    msg,
    level = LOG_LEVEL.INFO, 
    player = null,
    context = 'paella-core'
}: PrintMessageParams) => {
    if (player && !(player as any).__logSettings) {
        setLogLevel(LOG_LEVEL.INFO, player);
    }

    const current = currentLogLevel(player);
    if (level < LOG_LEVEL.DISABLED) {
        throw Error(`printMessage: invalid log level ${ level }`);
    }

    if (player) {
        triggerEvent(player, Events.LOG, { severity: level, context, message: msg, currentLogLevel: current });
    }

    if (level <= current) {
        switch (level) {
        case LOG_LEVEL.ERROR:
            console.error(`${ context } - Error: ${msg}`);
            break;
        case LOG_LEVEL.WARN:
            console.warn(`${ context } - Warning: ${msg}`);
            break;
        case LOG_LEVEL.INFO:
            console.info(`${ context } - Info: ${msg}`);
            break;
        case LOG_LEVEL.DEBUG:
            console.debug(`${ context } - Debug: ${msg}`);
            break;
        case LOG_LEVEL.VERBOSE:
            console.log(`${ context } - Verbose: ${msg}`);
            break;
        }
    }
};

export const log = {
    setLevel: (level: LogLevel, player: Paella | null = null) => {
        setLogLevel(level, player);
    },

    currentLevel: (player: Paella | null = null) => {
        return currentLogLevel(player);
    },

    error: (msg: string, player: Paella | null = null, context: string = 'paella-core') => {
        printMessage({
            msg, 
            level: LOG_LEVEL.ERROR, 
            player, 
            context 
        });
    },

    warn: (msg: string, player: Paella | null = null, context: string = 'paella-core') => {
        printMessage({
            msg, 
            level: LOG_LEVEL.WARN, 
            player, 
            context 
        });
    },

    info: (msg: string, player: Paella | null = null, context: string = 'paella-core') => {
        printMessage({
            msg, 
            level: LOG_LEVEL.INFO, 
            player, 
            context 
        });
    },

    debug: (msg: string, player: Paella | null = null, context: string = 'paella-core') => {
        printMessage({
            msg, 
            level: LOG_LEVEL.DEBUG, 
            player, 
            context 
        });
    },

    verbose: (msg: string, player: Paella | null = null, context: string = 'paella-core') => {
        printMessage({
            msg, 
            level: LOG_LEVEL.VERBOSE, 
            player, 
            context 
        });
    }
}


export default class Log {
    private _player: Paella;
    private _context: string;

    constructor(player: Paella, context: string = "paella-core") {
        this._player = player;
        this._context = context;
    }

    get context(): string {
        return this._context;
    }

    get player(): Paella {
        return this._player;
    }

    setLevel(level: LogLevel): void {
        log.setLevel(level, this._player);
    }

    currentLevel(): LogLevelValue {
        return log.currentLevel(this._player);
    }

    error(msg: string, context: string | null = null): void {
        log.error(msg, this._player, context || this._context);
    }

    warn(msg: string, context: string | null = null): void {
        log.warn(msg, this._player, context || this._context);
    }

    info(msg: string, context: string | null = null): void {
        log.info(msg, this._player, context || this._context);
    }

    debug(msg: string, context: string | null = null): void {
        log.debug(msg, this._player, context || this._context);
    }

    verbose(msg: string, context: string | null = null): void {
        log.verbose(msg, this._player, context || this._context);
    }
}
