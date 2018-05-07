import * as bodyParser from 'body-parser';
import * as express from 'express';

import {ServerConf} from './model/server-conf';
import {Logger} from './logger';
import {Endpoint} from "./model/endpoint";
import {Request, Response} from "express";

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
            Logger.info(`${endpoint.method.toUpperCase()} ${this.serverConf.prefix}${endpoint.path} - Mapped successfully.`);
        });
        Logger.info('Finishing mapping API endpoints.');
        this.app.use(this.serverConf.prefix, router);
        Logger.info(`API registered at http://localhost:${this.serverConf.port}${this.serverConf.prefix}.`);
        if (this.serverConf.staticConf) {
            this.app.use(this.serverConf.staticConf.prefix, express.static(this.serverConf.staticConf.root));
            Logger.info(`Static content is being served at http://localhost:${this.serverConf.port}${this.serverConf.staticConf.prefix}`);
        } else {
            Logger.warn('No static content is being served.');
        }
        this.app.listen(this.serverConf.port);
        Logger.info('Open for business!');
    }

}