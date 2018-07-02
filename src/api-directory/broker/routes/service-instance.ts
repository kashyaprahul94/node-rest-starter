import { Router } from "express";

import { App } from "@sap/loyalty/api-directory/app";

import { BaseRoute, Route, RouteType, ExtendedRequest, ExtendedResponse, TraitServiceBroker } from "@sap/loyalty/api-directory/base";
import { StatusCode, HTTPError } from "@sap/loyalty/common/networking";
import { Logger } from "@sap/loyalty/common/logger";

import { BrokerDelegate } from "../services";
import { BrokerConfig } from "../config";


export class ServiceInstanceRoute extends BaseRoute implements Route {

	public basePath: RouteType;
	private config: BrokerConfig;

	private delegate: BrokerDelegate;

	public constructor ( appInstance: App.Type, router: Router, config: BrokerConfig ) {

		super( appInstance, router, [
			new TraitServiceBroker( appInstance, router )
		]);

		this.config = config;
		this.basePath = [ this.config.getBasePath(), "service_instances" ].join( "/" );

		this.delegate = new BrokerDelegate( this.appInstance );
	}

	public create (): Router {

		this.configureMiddlewares();

		this.router.route( "/:instance_id" )
			.put( this.createServiceInstance )
			.patch( this.updateServiceInsance )
			.delete( this.deleteServiceInstance )
		;

		this.router.route( "/:instance_id/service_bindings/:binding_id" )
			.put( this.createServiceBinding )
			.delete( this.deleteServiceBinding )
		;

		return this.router;
	}



	private createServiceInstance = ( request: ExtendedRequest, response: ExtendedResponse ): void => {

		const serviceBroker = request.serviceBroker;

		this.delegate.createServiceInstance(
			serviceBroker.getInstanceId(),
			serviceBroker.getOrganizationId(),
			serviceBroker.getPlanId(),
			serviceBroker.getParameters()
		)
			.subscribe( ( credentials: any ) => {
				response.status( StatusCode.Created ).json( credentials );
			}, ( error: HTTPError ) => {
				Logger.Error( "Error occured", error.stringify() );
				response.status( StatusCode.Okay ).json( {} );
			})
		;
	};

	private updateServiceInsance = ( request: ExtendedRequest, response: ExtendedResponse ): void => {

		const serviceBroker = request.serviceBroker;

		this.delegate.updateServiceInstance(
			serviceBroker.getInstanceId(),
			serviceBroker.getParameters()
		)
			.subscribe( ( credentials: any ) => {
				response.status( StatusCode.Okay ).json( credentials );
			}, ( error: HTTPError ) => {
				Logger.Error( "Error occured", error.stringify() );
				response.status( StatusCode.Okay ).json( {} );
			})
		;
	};

	private deleteServiceInstance = ( request: ExtendedRequest, response: ExtendedResponse ): void => {
		this.delegate.deleteServiceInstance( request.serviceBroker.getInstanceId() )
			.subscribe( () => {
				response.status( StatusCode.Okay ).json( {} );
			}, ( error: HTTPError ) => {
				Logger.Error( "Error occured", error.stringify() );
				response.status( StatusCode.Okay ).json( {} );
			})
		;
	};



	private createServiceBinding = ( request: ExtendedRequest, response: ExtendedResponse ): void => {
		this.delegate.getServiceBinding( request.serviceBroker.getInstanceId() )
			.subscribe( ( credentials: any ) => {
				response.status( StatusCode.Okay ).json( credentials );
			}, ( error: HTTPError ) => {
				Logger.Error( "Error occured", error.stringify() );
				response.status( StatusCode.Okay ).json( {} );
			})
		;
	};

	private deleteServiceBinding = ( request: ExtendedRequest, response: ExtendedResponse ): void => {
		this.delegate.deleteServiceBinding( request.serviceBroker.getInstanceId() )
			.subscribe( () => {
				response.status( StatusCode.Okay ).json( {} );
			}, ( error: HTTPError ) => {
				Logger.Error( "Error occured", error.stringify() );
				response.status( StatusCode.Okay ).json( {} );
			})
		;
	};
}