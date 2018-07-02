import { IURI } from "../interfaces";

export class URI {

	protected path: string;
	protected version: string;
	protected base: string;
	protected proxy: string;

	public constructor ( path: string = "", version: string = "", base: string = "", proxy: string = "" ) {
		this.path = path;
		this.version = version;
		this.base = base;
		this.proxy = proxy;
	}

	public getPath (): string {
		return this.path;
	}
	public setPath ( path: string ): URI {
		this.path = path;
		return this;
	}

	public getVersion (): string {
		return this.version;
	}
	public setVersion ( version: string ): URI {
		this.version = version;
		return this;
	}

	public getBase (): string {
		return this.base;
	}
	public setBase ( base: string ): URI {
		this.base = base;
		return this;
	}

	public getProxy (): string {
		return this.proxy;
	}
	public setProxy ( proxy: string ): URI {
		this.proxy = proxy;
		return this;
	}



	public static FromJSON ( input: IURI ): URI {
		return new URI()
			.setPath( input.path )
			.setVersion( input.version )
			.setBase( input.base )
			.setProxy( input.proxy )
		;
	}

	public serialize (): string {
		return JSON.stringify({
			//path: this.path,
			//version: this.version,
			base: this.base,
			//proxy: this.proxy
		});
	}

	public static deserialize ( input: string ): URI {
		return URI.FromJSON( <IURI>JSON.parse( input ) );
	}
}