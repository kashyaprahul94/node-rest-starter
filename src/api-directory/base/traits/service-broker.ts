import { Router, NextFunction } from "express";

import { App } from "@sap/loyalty/api-directory/app";

import { Trait } from "./trait";
import { ExtendedRequest, ExtendedResponse } from "@sap/loyalty/api-directory/base/interfaces";
import { ServiceBroker } from "@sap/loyalty/api-directory/base/models";

export class TraitServiceBroker extends Trait {

	private router: Router;

	constructor ( appInstance: App.Type, router: Router ) {
		super( appInstance );
		this.router = router;
		this.configureParams();
	}

	public middleware = ( request: ExtendedRequest, response: ExtendedResponse, next: NextFunction ): void => {
		request.serviceBroker = new ServiceBroker()
			.setInstanceId( request.params.instance_id || "" )
			.setBindingId( request.params.binding_id || "" )
			.setServiceId( request.body.service_id || "" )
			.setPlanId( request.body.plan_id || "" )
			.setOrganizationId( request.body.context && request.body.context.organization_guid || "" )
			.setSpaceId( request.body.context && request.body.context.space_guid || "" )
			.setParameters( request.body.parameters || {} )
		;
		next();
	};

	private configureParams = (): void => {
		this.router.param( "instance_id", ( request: ExtendedRequest, response: ExtendedResponse, next: NextFunction, instanceId: string ) => {
			request.serviceBroker.setInstanceId( instanceId );
			next();
		});
		this.router.param( "binding_id", ( request: ExtendedRequest, response: ExtendedResponse, next: NextFunction, bindingId: string ) => {
			request.serviceBroker.setBindingId( bindingId );
			next();
		});
	}
}