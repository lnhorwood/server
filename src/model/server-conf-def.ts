import {LogConfDef} from "./log-conf-def";
import {EndpointDef} from "./endpoint-def";
import {StaticConfDef} from "./static-conf-def";
import {ProxyDef} from "./proxy-def";
import * as socketIo from "socket.io";

export interface ServerConfDef {
    logConf?: LogConfDef;
    endpoints?: EndpointDef[];
    port?: number;
    prefix?: string;
    staticConf?: StaticConfDef;
    proxies?: ProxyDef[];
    sockets?: boolean;
    socketsCallback?: (io: socketIo.Server) => void;
}