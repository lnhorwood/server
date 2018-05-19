import * as rimraf from 'rimraf';
import * as socketIo from 'socket.io';
import * as io from 'socket.io-client';

import {Server} from "./server";
import {ServerConf} from "./model/server-conf";
import {Logger} from "./logger";

describe('Server', () => {
    beforeEach(() => {
        spyOn(rimraf, 'sync');
        spyOn(Logger, 'error');
    });
    describe('start', () => {
        afterEach(() => {
            Server.shutdown();
        });
        it('should instantiate the express application without sockets', () => {
            Server.start(new ServerConf({}));
            expect(Server.app).toBeDefined();
            expect(Server.io).toBeUndefined();
            expect(Logger.error).not.toHaveBeenCalled();
        });
        it('should instantiate the express application with sockets', () => {
            Server.start(new ServerConf({
                sockets: true
            }));
            expect(Server.app).toBeDefined();
            expect(Server.io).toBeDefined();
            expect(Logger.error).not.toHaveBeenCalled();
        });
        it('should log an error when the server has already been started', () => {
            Server.start(new ServerConf({}));
            Server.start(new ServerConf({}));
            expect(Logger.error).toHaveBeenCalledWith('Tried to start a HTTP server but a server is already running.');
        });
    });
    describe('shutdown', () => {
        beforeEach(() => {
            Server.start(new ServerConf({
                sockets: true
            }));
        });
        it('should set the express application and socket server to be undefined', () => {
            expect(Server.app).toBeDefined();
            expect(Server.io).toBeDefined();
            Server.shutdown();
            expect(Server.app).toBeUndefined();
            expect(Server.io).toBeUndefined();
            expect(Logger.error).not.toHaveBeenCalled();
        });
        it('should log an error when the server has already been shutdown', () => {
            Server.shutdown();
            Server.shutdown();
            expect(Logger.error).toHaveBeenCalledWith('Tried to shutdown HTTP server but no server was running.');
        });
    });
});