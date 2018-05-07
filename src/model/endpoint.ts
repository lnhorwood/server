import {Request,Response} from 'express';
import {EndpointDef} from "./endpoint-def";
import {HttpMethod} from "./http-method";
import {Logger} from "../logger";

export class Endpoint implements EndpointDef {

    private _method: HttpMethod;
    private _path: string;
    private _callback: (req: Request, res: Response) => void;

    constructor(endpointDef: EndpointDef) {
        this.method = HttpMethod[endpointDef.method];
        this.path = endpointDef.path;
        this.callback = endpointDef.callback;
    }

    get method(): HttpMethod {
        return this._method;
    }

    set method(value: HttpMethod) {
        this._method = value;
    }

    get path(): string {
        return this._path;
    }

    set path(value: string) {
        this._path = value;
    }

    get callback(): (req: Request, res: Response) => void {
        return this._callback;
    }

    set callback(value: (req: Request, res: Response) => void) {
        this._callback = value;
    }

    isValid(): boolean {
        return this.isPathValid() && this.isMethodValid() &&  this.isCallbackValid();
    }

    private isMethodValid(): boolean {
        const isMethodValid: boolean = !(!this.method);
        if (!isMethodValid) {
            Logger.error(`Error mapping endpoint - No valid method provided for endpoint with path '${this.path}'. Valid methods: ${Object.keys(HttpMethod).join(',')}.`);
        }
        return isMethodValid;
    }

    private isPathValid(): boolean {
        const isPathValid: boolean = this.path !== undefined && this.path !== null;
        if (!isPathValid) {
            Logger.error('Error mapping endpoint - No valid path provided.');
        }
        return isPathValid;
    }

    private isCallbackValid(): boolean {
        const isCallbackValid: boolean = !(!this.callback);
        if (!isCallbackValid) {
            Logger.error(`Error mapping endpoint - No valid callback provided for endpoint with path '${this.path}' and method '${this.method.toUpperCase()}'.`);
        }
        return isCallbackValid;
    }

}