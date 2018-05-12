import {Logger} from "../logger";
import {ProxyDef} from "./proxy-def";

export class Proxy implements ProxyDef {

    private _path: string;
    private _destination: string;

    constructor(proxyDef: ProxyDef) {
        this.path = proxyDef.path;
        this.destination = proxyDef.destination;
    }

    get path(): string {
        return this._path;
    }

    set path(value: string) {
        this._path = value;
    }

    get destination(): string {
        return this._destination;
    }

    set destination(value: string) {
        this._destination = value;
    }

    isValid(): boolean {
        return this.isPathValid() && this.isDestinationValid();
    }

    private isPathValid(): boolean {
        const isPathValid: boolean = this.path !== undefined && this.path !== null;
        if (!isPathValid) {
            Logger.error('Error mapping proxy - No valid path provided.');
        }
        return isPathValid;
    }

    private isDestinationValid(): boolean {
        const isDestinationValid: boolean = this.destination !== undefined && this.destination !== null;
        if (!isDestinationValid) {
            Logger.error(`Error mapping proxy - No valid destination provided for proxy with path '${this.path}'.`);
        }
        return isDestinationValid;
    }

}