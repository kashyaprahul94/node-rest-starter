import { BaseConfig, TypeURL } from "@sap/loyalty/api-directory/base/config";

export class BrokerConfig extends BaseConfig {

	private static RoutePath: TypeURL = "/v2";

	constructor () {
		super( BrokerConfig.RoutePath, "" );
	}
}