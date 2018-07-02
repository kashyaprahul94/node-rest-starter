export type TypeURL = string | RegExp;

export class BaseConfig {

	private basePath: TypeURL;
	private version: string;

	constructor ( basePath: TypeURL, version: string = "" ) {
		this.basePath = basePath;
		this.version = version;
	}

	public getBasePath (): TypeURL {
		if ( this.version ) {
			return [ this.basePath, this.version ].join( "/" );
		} else {
			return this.basePath;
		}
	}
}