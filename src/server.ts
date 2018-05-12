import * as bodyParser from 'body-parser';
import * as express from 'express';

import {ServerConf} from './model/server-conf';
import {Logger} from './logger';
import {Endpoint} from "./model/endpoint";
import {Request, Response} from "express";
import {Proxy} from "./model/proxy";
import * as expressHttpProxy from 'express-http-proxy';
import {URL} from './url';

export class Server {

    private serverConf: ServerConf;
    private app: express.Application;

    constructor(serverConf: ServerConf) {
        this.serverConf = serverConf;
        this.configureLogger();
        this.configureServer();
    }

    private configureLogger(): void {
        Logger.configure(this.serverConf.logConf);
    }

    private configureServer(): void {
        Logger.info('Configuring server.');
        const router: express.Router = express.Router();
        this.app = express();
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(bodyParser.json());
        Logger.info('Mapping API endpoints.');
        this.serverConf.endpoints.filter((endpoint: Endpoint) => endpoint.isValid()).forEach((endpoint: Endpoint) => {
            router[endpoint.method](endpoint.path, (req: Request, res: Response) => {
                Logger.verbose(`Request: ${endpoint.method.toUpperCase()} - ${this.serverConf.prefix}${endpoint.path}`);
                endpoint.callback(req, res);
            });
            Logger.info(`${endpoint.method.toUpperCase()} ${URL.join(this.serverConf.prefix, endpoint.path)} - Mapped successfully.`);
        });
        Logger.info('Finishing mapping API endpoints.');
        Logger.info('Mapping API proxies.');
        this.serverConf.proxies.filter((proxy: Proxy) => proxy.isValid()).forEach((proxy: Proxy) => {
            const from: string = URL.join(this.serverConf.prefix, proxy.path);
            this.app.use(from, expressHttpProxy(proxy.destination, {
                proxyReqPathResolver: (req: Request) => {
                    const destination: string = URL.concat(proxy.destination, req.url);
                    Logger.verbose(`Request: ${req.method} - ${URL.join(from, req.url)} proxied to ${destination}`);
                    return destination;
                }
            }));
            Logger.info(`Proxy created from ${from} to ${proxy.destination}.`);
        });
        Logger.info('Finished mapping API proxies.');
        this.app.use(this.serverConf.prefix, router);
        Logger.info(`API registered at http://localhost:${this.serverConf.port}${URL.join(this.serverConf.prefix)}.`);
        if (this.serverConf.staticConf) {
            this.app.use(this.serverConf.staticConf.prefix, express.static(this.serverConf.staticConf.root));
            Logger.info(`Static content is being served at http://localhost:${this.serverConf.port}${URL.join(this.serverConf.staticConf.prefix)}`);
        } else {
            Logger.warn('No static content is being served.');
        }
        this.app.listen(this.serverConf.port);
        Logger.info('Open for business!');
    }

}