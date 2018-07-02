export interface IServiceClient {
	id: string;
	appId: string;
	orgId: string;
	uri: {
		base: string;
		proxy: string;
	},
	auth: {
		basic: {
			username: string;
			password: string;
		},
		oauth2: {
			tokenURI: string;
			clientId: string;
			clientSecret: string;
			scopes: string[];
			grantType: string;
		},
		rules: {
			[ path: string ]: {
				[ method: string ]: string[]
			}
		}
	}
}