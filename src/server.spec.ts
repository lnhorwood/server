import {Server} from "./server";
import {ServerConf} from "./model/server-conf";

describe('Server', () => {
    describe('constructor', () => {
        it('should exist', () => {
            const server: Server = new Server(new ServerConf({}));
            expect(server).toBeDefined();
            expect(server instanceof Server).toBeTruthy();
        });
    });
});