import {Request, Response} from "express";

export interface EndpointDef {
    method: string;
    path: string;
    callback: (req: Request, res: Response) => void;
}