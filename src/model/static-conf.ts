import {StaticConfDef} from "./static-conf-def";

export class StaticConf implements StaticConfDef {

    private _prefix: string;
    private _root: string;

    constructor(staticConfDef: StaticConfDef) {
        this.prefix = staticConfDef.prefix;
        this.root = staticConfDef.root;
    }

    get prefix(): string {
        return this._prefix;
    }

    set prefix(value: string) {
        this._prefix = value;
    }

    get root(): string {
        return this._root;
    }

    set root(value: string) {
        this._root = value;
    }

}