import {ServerConfDef} from "./server-conf-def";
import {LogConf} from "./log-conf";
import {Endpoint} from "./endpoint";
import {StaticConf} from "./static-conf";
import {EndpointDef} from "./endpoint-def";
import {ProxyDef} from "./proxy-def";
import {Proxy} from "./proxy";

export class ServerConf implements ServerConfDef {

    private _logConf: LogConf;
    private _endpoints: Endpoint[];
    private _port: number;
    private _prefix: string;
    private _staticConf: StaticConf;
    private _proxies: ProxyDef[];

    constructor(serverConfDef: ServerConfDef) {
        this.logConf = new LogConf(serverConfDef.logConf);
        this.endpoints = (serverConfDef.endpoints ? serverConfDef.endpoints : []).map((endpointDef: EndpointDef) => new Endpoint(endpointDef));
        this.prefix = serverConfDef.prefix ? serverConfDef.prefix : '/api';
        this.port = serverConfDef.port ? serverConfDef.port : 8080;
        if (serverConfDef.staticConf) {
            this.staticConf = new StaticConf(serverConfDef.staticConf);
        }
        this.proxies = (serverConfDef.proxies ? serverConfDef.proxies : []).map((proxyDef: ProxyDef) => new Proxy(proxyDef));
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

    get proxies(): ProxyDef[] {
        return this._proxies;
    }

    set proxies(value: ProxyDef[]) {
        this._proxies = value;
    }

}