import { Orchestrator, Route } from "@sap/loyalty/api-directory/base";

import { HealthConfig } from "../config";
import { HealthRoute } from "./health";

export class HealthOrchestrator extends Orchestrator {

	private config: HealthConfig;

	public constructor () {
		super();
		this.config = new HealthConfig();
	}

	public routes (): Route[] {
		const health: HealthRoute = new HealthRoute( this.appInstance, this.router, this.config );
		return [ health ];
	}
}