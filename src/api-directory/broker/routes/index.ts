import { Orchestrator, Route } from "@sap/loyalty/api-directory/base";

import { BrokerConfig } from "../config";
import { CatalogRoute } from "./broker";
import { ServiceInstanceRoute } from "./service-instance";

export class BrokerOrchestrator extends Orchestrator {

	private config: BrokerConfig;

	public constructor () {
		super();
		this.config = new BrokerConfig();
	}

	public routes (): Route[] {
		const catalog: CatalogRoute = new CatalogRoute( this.appInstance, this.router, this.config );
		const serviceInstance: ServiceInstanceRoute = new ServiceInstanceRoute( this.appInstance, this.router, this.config );
		return [ catalog, serviceInstance ];
	}
}