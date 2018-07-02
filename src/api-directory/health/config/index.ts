import { BaseConfig, TypeURL } from "@sap/loyalty/api-directory/base/config";

export class HealthConfig extends BaseConfig {

	private static RoutePath: TypeURL = "/";

	constructor () {
		super( HealthConfig.RoutePath, "" );
	}
}