import { Request, Response, NextFunction } from "express";

import { App } from "@sap/loyalty/api-directory/app";

export interface ITrait {
	middleware: ( request: Request, response: Response, next: NextFunction ) => void;
}

export abstract class Trait implements ITrait {

	protected appInstance: App.Type;

	constructor ( appInstance: App.Type ) {
		this.appInstance = appInstance;
	}

	public middleware = ( request: Request, response: Response, next: NextFunction ): void => {
		next();
	};
}