import { Router, Request, Response } from "express";

import { App } from "@sap/loyalty/api-directory/app";

import { BaseRoute, Route, RouteType } from "@sap/loyalty/api-directory/base";
import { StatusCode } from "@sap/loyalty/common/networking";

import { HealthConfig } from "../config";

export class HealthRoute extends BaseRoute implements Route {

	public basePath: RouteType;
	private config: HealthConfig;

	public constructor ( appInstance: App.Type, router: Router, config: HealthConfig ) {

		super( appInstance, router, [

		]);

		this.config = config;
		this.basePath = [ this.config.getBasePath() ].join( "/" );
	}

	public create (): Router {

		this.configureMiddlewares();

		this.router.route( "/" )
			.all( this.getHealth )
		;

		this.router.route( "/health" )
			.all( this.getHealth )
		;

		return this.router;
	}



	private getHealth = ( req: Request, res: Response ): void => {
		res.status( StatusCode.Okay ).json({
			status: "UP"
		});
	};
}