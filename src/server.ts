import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as http from 'http';
import * as httpShutdown from 'http-shutdown';

import {ServerConf} from './model/server-conf';
import {Logger} from './logger';
import {Endpoint} from "./model/endpoint";
import {Request, Response} from "express";
import {Proxy} from "./model/proxy";
import * as expressHttpProxy from 'express-http-proxy';
import {URL} from './url';

export class Server {

    private static _serverConf: ServerConf;
    private static _app: express.Application;
    private static _http: httpShutdown.Server;
    private static _io: socketIo.Server;

    static start(_serverConf: ServerConf) {
        if (!Server._http) {
            Server._serverConf = _serverConf;
            Server.configureLogger();
            Server.configureServer();
        } else {
            Logger.error('Tried to start a HTTP server but a server is already running.');
        }
    }

    static shutdown() {
        if (Server._http) {
            Server._http.shutdown();
            delete Server._http;
            delete Server._io;
            delete Server._app;
        } else {
            Logger.error('Tried to shutdown HTTP server but no server was running.');
        }
    }

    static get app(): express.Application {
        return Server._app;
    }

    static get io(): socketIo.Server {
        return Server._io;
    }

    private static configureLogger(): void {
        Logger.configure(Server._serverConf.logConf);
    }

    private static configureServer(): void {
        Logger.info('Configuring server.');
        const router: express.Router = express.Router();
        Server._app = express();
        Server._app.use(bodyParser.urlencoded({
            extended: true
        }));
        Server._app.use(bodyParser.json());
        Logger.info('Mapping API endpoints.');
        Server._serverConf.endpoints.filter((endpoint: Endpoint) => endpoint.isValid()).forEach((endpoint: Endpoint) => {
            router[endpoint.method](endpoint.path, (req: Request, res: Response) => {
                Logger.verbose(`Request: ${endpoint.method.toUpperCase()} - ${Server._serverConf.prefix}${endpoint.path}`);
                endpoint.callback(req, res);
            });
            Logger.info(`${endpoint.method.toUpperCase()} ${URL.join(Server._serverConf.prefix, endpoint.path)} - Mapped successfully.`);
        });
        Logger.info('Finishing mapping API endpoints.');
        Logger.info('Mapping API proxies.');
        Server._serverConf.proxies.filter((proxy: Proxy) => proxy.isValid()).forEach((proxy: Proxy) => {
            const from: string = URL.join(Server._serverConf.prefix, proxy.path);
            Server._app.use(from, expressHttpProxy(proxy.destination, {
                proxyReqPathResolver: (req: Request) => {
                    const destination: string = URL.concat(proxy.destination, req.url);
                    Logger.verbose(`Request: ${req.method} - ${URL.join(from, req.url)} proxied to ${destination}`);
                    return destination;
                }
            }));
            Logger.info(`Proxy created from ${from} to ${proxy.destination}.`);
        });
        Logger.info('Finished mapping API proxies.');
        Server._app.use(Server._serverConf.prefix, router);
        Logger.info(`API registered at http://localhost:${Server._serverConf.port}${URL.join(Server._serverConf.prefix)}.`);
        if (Server._serverConf.staticConf) {
            Server._app.use(Server._serverConf.staticConf.prefix, express.static(Server._serverConf.staticConf.root));
            Logger.info(`Static content is being served at http://localhost:${Server._serverConf.port}${URL.join(Server._serverConf.staticConf.prefix)}`);
        } else {
            Logger.warn('No static content is being served.');
        }
        Server._http = httpShutdown(new http.Server(Server._app));
        if (Server._serverConf.sockets) {
            Server._io = socketIo(Server._http);
            Logger.info('Sockets have been enabled.');
        }
        Server._http.listen(Server._serverConf.port);
        Logger.info('Open for business!');
    }

}