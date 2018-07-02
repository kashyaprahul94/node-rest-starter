import { Orchestrator, Route } from "@sap/loyalty/api-directory/base";

import { ClientConfig } from "../config";
import { ServiceClientRoute } from "./service-client";
import { ApplicationClientRoute } from "./application-client";

export class ClientOrchestrator extends Orchestrator {

	private config: ClientConfig;

	public constructor () {
		super();
		this.config = new ClientConfig();
	}

	public routes (): Route[] {
		const serviceClient: ServiceClientRoute = new ServiceClientRoute( this.appInstance, this.router, this.config );
		const applicationClient: ApplicationClientRoute = new ApplicationClientRoute( this.appInstance, this.router, this.config );
		return [ serviceClient, applicationClient ];
	}
}