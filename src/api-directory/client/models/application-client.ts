import { IApplicationClient } from "../interfaces";

import { URI } from "./uri";
import { Auth } from "./auth";

export class ApplicationClient {

	protected id: string;
	protected uri: URI;
	protected auth: Auth;

	public constructor () {
		this.id = "";
		this.uri = new URI();
		this.auth = new Auth();
	}

	public getId (): string {
		return this.id;
	}
	public setId ( id: string ): ApplicationClient {
		this.id = id;
		return this;
	}

	public getURI (): URI {
		return this.uri;
	}
	public setURI ( uri: URI ): ApplicationClient {
		this.uri = uri;
		return this;
	}
	public getURIString (): string {
		return this.uri.toString();
	}

	public getAuth (): Auth {
		return this.auth;
	}
	public setAuth ( auth: Auth ): ApplicationClient {
		this.auth = auth;
		return this;
	}
	public getAuthString (): string {
		return this.auth.toString();
	}


	public static FromJSON ( input: IApplicationClient ): ApplicationClient {
		return new ApplicationClient()
			.setId( input.id )
			.setURI( URI.deserialize( input.uri.toString() ) )
			.setAuth( Auth.deserialize( input.auth.toString() ) )
		;
	}

	public generateCredentials (): any {
		return {
			credentials: {
				id: this.getId(),
				uri_base: this.getURI().getBase(),
				uri_proxy: this.getURI().getProxy(),
			}
		}
	}

	public serialize (): string {
		return JSON.stringify({
			id: this.id,
			uri: this.uri.serialize(),
			auth: this.auth.serialize()
		});
	}

	public static deserialize ( input: string ): ApplicationClient {
		return ApplicationClient.FromJSON( <IApplicationClient>JSON.parse( input ) );
	}
}