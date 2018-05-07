#!/usr/bin/env node

import {resolve} from 'path';
import {argv} from 'yargs';

import {Logger} from './logger';
import {Server} from './server';
import {ServerConf} from './model/server-conf';
import {ServerConfDef} from './model/server-conf-def';

process.on('exit', () => {
    Logger.info('Shutting down...');
});
process.on('SIGINT', () => {
    process.exit();
});
process.on('SIGUSR1', () => {
    process.exit();
});
process.on('SIGUSR2', () => {
    process.exit();
});
process.on('uncaughtException', (err) => {
    Logger.error(err.stack);
    process.exit();
});

const serverConfPath = argv['server-conf'] ? resolve(argv['server-conf']) : resolve(process.env.PWD, 'server.conf');
let serverConf: ServerConfDef;
try {
    serverConf = require(serverConfPath);
} catch(error) {
    Logger.error(`Unable to find server.conf module at '${serverConfPath}'; please provide a valid server.conf module.`);
    process.exit(error.code);
}
new Server(new ServerConf(serverConf));