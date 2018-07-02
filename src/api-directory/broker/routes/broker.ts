import { Router, Request, Response } from "express";

import { App } from "@sap/loyalty/api-directory/app";

import { BaseRoute, Route, RouteType } from "@sap/loyalty/api-directory/base";
import { StatusCode } from "@sap/loyalty/common/networking";

import { BrokerConfig } from "../config";
import { BrokerDelegate } from "../services/delegate";

export class CatalogRoute extends BaseRoute implements Route {

	public basePath: RouteType;
	private config: BrokerConfig;

	private delegate: BrokerDelegate;

	public constructor ( appInstance: App.Type, router: Router, config: BrokerConfig ) {

		super( appInstance, router, [

		]);

		this.config = config;
		this.basePath = this.config.getBasePath();

		this.delegate = new BrokerDelegate( appInstance );
	}

	public create (): Router {

		this.configureMiddlewares();

		this.router.route( "/catalog" )
			.get( this.getCatalog )
		;

		return this.router;
	}

	private getCatalog = ( req: Request, res: Response ): void => {
		res.status( StatusCode.Okay ).json( this.delegate.getCatalogItems() );
	};
}