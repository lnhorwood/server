import {LogConfDef} from "./log-conf-def";
import {resolve} from "path";
import {LogLevel} from "./log-level";

const defaultLogConfDef: LogConfDef = {
    location: resolve(process.env.PWD, 'logs'),
    preserve: false,
    level: 'INFO'
};

export class LogConf implements LogConfDef {

    private _location: string;
    private _preserve: boolean;
    private _level: LogLevel;

    constructor(logConfDef: LogConfDef = defaultLogConfDef) {
        this.location = resolve(logConfDef.location ? logConfDef.location : defaultLogConfDef.location);
        this.preserve = logConfDef.preserve === true || logConfDef.preserve === false ? logConfDef.preserve : defaultLogConfDef.preserve;
        this.level = LogLevel[logConfDef.level ? logConfDef.level : defaultLogConfDef.level];
    }

    get location(): string {
        return this._location;
    }

    set location(value: string) {
        this._location = value;
    }

    get preserve(): boolean {
        return this._preserve;
    }

    set preserve(value: boolean) {
        this._preserve = value;
    }

    get level(): LogLevel {
        return this._level;
    }

    set level(value: LogLevel) {
        this._level = value;
    }

}