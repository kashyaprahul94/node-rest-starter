import { Router } from "express";

import { App } from "@sap/loyalty/api-directory/app";

import { ITrait } from "../traits";

export class BaseRoute {

	protected appInstance: App.Type;
	protected router: Router;
	protected middlewares: ITrait[];

	public constructor ( appInstance: App.Type, router: Router, middlewares: ITrait[] = [] ) {

		this.appInstance = appInstance;
		this.router = router;
		this.middlewares = middlewares;
	}

	public configureMiddlewares (): void {
		if ( this.middlewares.length ) {
			this.router.use( this.middlewares.map( middleware => middleware.middleware ) );
		}
	}
}