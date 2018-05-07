import {existsSync, mkdirSync} from 'fs';
import {sync as rimrafSync} from 'rimraf';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import {LogConf} from "./model/log-conf";
import {LogLevel} from "./model/log-level";

class LoggerManager {

    private static logger;

    static configure(logConf?: LogConf) {
        if (LoggerManager.logger) {
            LoggerManager.logger.close();
        }
        LoggerManager.logger = winston.createLogger({
            level: logConf ? logConf.level : LogLevel.ERROR,
            format:  winston.format.json(),
            transports: LoggerManager.getTransports(logConf)
        });
    }

    static log(level: string, message: string) {
        if (!LoggerManager.logger) {
            LoggerManager.configure();
        }
        LoggerManager.logger.log(level, message);
    }

    private static getTransports(logConf?: LogConf) {
        let transports = [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.timestamp(),
                    winston.format.align(),
                    winston.format.printf(LoggerManager.print),
                )
            })
        ];
        if (logConf) {
            transports = transports.concat(LoggerManager.createFileTransports(logConf));
        }
        return transports;
    }

    private static createFileTransports(logConf: LogConf) {
        if (existsSync(logConf.location) && !logConf.preserve) {
            rimrafSync(logConf.location);
        }
        if (!existsSync(logConf.location)) {
            mkdirSync(logConf.location);
        }
        return [
            LoggerManager.createFileTransport(logConf.location, 'combined'),
            LoggerManager.createFileTransport(logConf.location, 'verbose', 'verbose'),
            LoggerManager.createFileTransport(logConf.location, 'info', 'info'),
            LoggerManager.createFileTransport(logConf.location, 'warn', 'warn'),
            LoggerManager.createFileTransport(logConf.location, 'error', 'error')
        ];
    };

    private static createFileTransport(directory: string, fileName: string, level?: string) {
        return new winston.transports.DailyRotateFile({
            dirname: directory,
            filename: `${fileName}-%DATE%.log`,
            zippedArchive: true,
            maxFiles: '14d',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.align(),
                winston.format.printf(LoggerManager.print),
            ),
            level: level
        });
    }

    private static print(info): string {
        return `${info.timestamp.replace('T', ' @ ').replace('Z', '')} [${info.level}]: ${info.message}`;
    }

}


export class Logger {

    static configure(logConf: LogConf): void {
        LoggerManager.configure(logConf);
        Logger.info(`Location of logs set to ${logConf.location}.`);
    }

    static verbose(message: string): void {
        LoggerManager.log('verbose', message);
    };

    static info(message: string): void {
        LoggerManager.log('info', message);
    };

    static warn(message: string): void {
        LoggerManager.log('warn', message);
    };

    static error(message: string): void {
        LoggerManager.log('error', message);
    };

}