import { IBasicAuth } from "../interfaces/basic";

export class BasicAuth {

	protected username: string;
	protected password: string;

	public constructor ( username: string = "", password: string = "" ) {
		this.username = username;
		this.password = password;
	}

	public getUsername (): string {
		return this.username;
	}
	public setUsername ( username: string ): BasicAuth {
		this.username = username;
		return this;
	}

	public getPassword (): string {
		return this.password;
	}
	public setPassword ( password: string ): BasicAuth {
		this.password = password;
		return this;
	}

	public static FromJSON ( input: IBasicAuth ): BasicAuth {
		return new BasicAuth( input.username, input.password );
	}

	public serialize (): string {
		return JSON.stringify({
			username: this.username,
			password: this.password
		});
	}

	public static deserialize ( input: string ): BasicAuth {
		return BasicAuth.FromJSON( <IBasicAuth>JSON.parse( input ) );
	}
}