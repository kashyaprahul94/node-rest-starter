import { Router, RouterOptions } from "express";

import { App } from "@sap/loyalty/api-directory/app";
import { Route } from "@sap/loyalty/api-directory/base";

export abstract class Orchestrator {

	protected appInstance: App.Type;
	protected router: Router;

	public constructor ( options?: RouterOptions ) {
		this.appInstance = App.Instance;
		this.router = Router( options );
	}

	public abstract routes (): Route[];
}