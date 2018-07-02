import { BaseConfig, TypeURL } from "@sap/loyalty/api-directory/base/config";

export class ClientConfig extends BaseConfig {

	private static RoutePath: TypeURL = "/client";

	constructor () {
		super( ClientConfig.RoutePath, "" );
	}
}