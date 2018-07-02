export interface IApplicationClient {
	id: string;
	uri: {
		base: string;
		proxy: string;
	},
	auth: {
		rules: {
			[ path: string ]: {
				[ method: string ]: string[]
			}
		}
	}
}