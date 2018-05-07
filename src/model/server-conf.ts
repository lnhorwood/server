import {ServerConfDef} from "./server-conf-def";
import {LogConf} from "./log-conf";
import {Endpoint} from "./endpoint";
import {StaticConf} from "./static-conf";
import {EndpointDef} from "./endpoint-def";

export class ServerConf implements ServerConfDef {

    private _logConf: LogConf;
    private _endpoints: Endpoint[];
    private _port: number;
    private _prefix: string;
    private _staticConf: StaticConf;

    constructor(serverConfDef: ServerConfDef) {
        this.logConf = new LogConf(serverConfDef.logConf);
        this.endpoints = (serverConfDef.endpoints ? serverConfDef.endpoints : []).map((endpointDef: EndpointDef) => new Endpoint(endpointDef));
        this.prefix = serverConfDef.prefix ? serverConfDef.prefix : '/api';
        this.port = serverConfDef.port ? serverConfDef.port : 8080;
        if (serverConfDef.staticConf) {
            this.staticConf = new StaticConf(serverConfDef.staticConf);
        }
    }

    get logConf(): LogConf {
        return this._logConf;
    }

    set logConf(value: LogConf) {
        this._logConf = value;
    }

    get endpoints(): Endpoint[] {
        return this._endpoints;
    }

    set endpoints(value: Endpoint[]) {
        this._endpoints = value;
    }

    get port(): number {
        return this._port;
    }

    set port(value: number) {
        this._port = value;
    }

    get prefix(): string {
        return this._prefix;
    }

    set prefix(value: string) {
        this._prefix = value;
    }

    get staticConf(): StaticConf {
        return this._staticConf;
    }

    set staticConf(value: StaticConf) {
        this._staticConf = value;
    }


}