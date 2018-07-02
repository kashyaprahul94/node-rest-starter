import { Router, Request, Response } from "express";

import { App } from "@sap/loyalty/api-directory/app";

import { BaseRoute, Route, RouteType } from "@sap/loyalty/api-directory/base";
import { StatusCode, HTTPError } from "@sap/loyalty/common/networking";
import { Logger } from "@sap/loyalty/common/logger";

import { ClientConfig } from "../config";
import { Config } from "../interfaces";
import { ServiceClient } from "../models";
import { ClientService } from "../services";


export class ServiceClientRoute extends BaseRoute implements Route {

	public basePath: RouteType;
	private config: ClientConfig;

	public constructor ( appInstance: App.Type, router: Router, config: ClientConfig ) {

		super( appInstance, router, [

		]);

		this.config = config;
		this.basePath = [ this.config.getBasePath(), "service" ].join( "/" );
	}

	public create (): Router {

		this.configureMiddlewares();

		this.router.route( "/" )
			.post( this.createClient )
		;

		this.router.route( "/:clientId" )
			.get( this.getClient )
			.put( this.updateClient )
			.delete( this.deleteClient )
		;

		return this.router;
	}



	private createClient = ( req: Request, res: Response ): void => {

		const config: Config = <Config>req.body;
		const orgId: string = req.body.orgId;
		const clientId: string = req.body.serviceInstanceId;

		new ClientService( this.appInstance ).createServiceClient( clientId, orgId, config )
			.subscribe( ( client: ServiceClient ) => {
				res.status( StatusCode.Created ).json( client.generateCredentials() );
			}, ( error: HTTPError ) => {
				Logger.Error( "Error occured", error.stringify() );
				res.status( error.getStatusCode() ).json( error.serialize() );
			})
		;
	};

	private getClient = ( req: Request, res: Response ): void => {

		const clientId: string = req.params.clientId;

		new ClientService( this.appInstance ).getServiceClientById( clientId )
			.subscribe( ( client: ServiceClient ) => {
				res.status( StatusCode.Created ).json( client );
			}, ( error: HTTPError ) => {
				Logger.Error( "Error occured", error.stringify() );
				res.status( error.getStatusCode() ).json( error.serialize() );
			})
		;
	};


	private updateClient = ( req: Request, res: Response ): void => {

		const clientId: string = req.params.clientId;
		const config: Config = <Config>req.body;

		new ClientService( this.appInstance ).updateServiceClient( clientId, config )
			.subscribe( ( client: ServiceClient ) => {
				res.status( StatusCode.Created ).json( client );
			}, ( error: HTTPError ) => {
				Logger.Error( "Error occured", error.stringify() );
				res.status( error.getStatusCode() ).json( error.serialize() );
			})
		;
	};


	private deleteClient = ( req: Request, res: Response ): void => {

		const clientId: string = req.params.clientId;

		new ClientService( this.appInstance ).removeServiceClientById( clientId )
			.subscribe( () => {
				res.status( StatusCode.NoContent ).end();
			}, ( error: HTTPError ) => {
				Logger.Error( "Error occured", error.stringify() );
				res.status( error.getStatusCode() ).json( error.serialize() );
			})
		;
	};
}