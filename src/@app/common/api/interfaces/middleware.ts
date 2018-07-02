import { NextFunction, Request, Response } from "express";

export interface APIMiddleware {
	middleware: ( request: Request, response: Response, next: NextFunction ) => void;
}