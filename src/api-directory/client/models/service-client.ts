import { IServiceClient } from "../interfaces";

import { URI } from "./uri";
import { Auth } from "./auth";

export class ServiceClient {

	protected id: string;
	protected appId: string;
	protected orgId: string;
	protected uri: URI;
	protected auth: Auth;

	public constructor () {
		this.id = "";
		this.appId = "";
		this.orgId = "";
		this.uri = new URI();
		this.auth = new Auth();
	}

	public getId (): string {
		return this.id;
	}
	public setId ( id: string ): ServiceClient {
		this.id = id;
		return this;
	}

	public getAppId (): string {
		return this.appId;
	}
	public setAppId ( appId: string ): ServiceClient {
		this.appId = appId;
		return this;
	}

	public getOrgId (): string {
		return this.orgId;
	}
	public setOrgId ( orgId: string ): ServiceClient {
		this.orgId = orgId;
		return this;
	}

	public getURI (): URI {
		return this.uri;
	}
	public setURI ( uri: URI ): ServiceClient {
		this.uri = uri;
		return this;
	}
	public getURIString (): string {
		return this.uri.toString();
	}

	public getAuth (): Auth {
		return this.auth;
	}
	public setAuth ( auth: Auth ): ServiceClient {
		this.auth = auth;
		return this;
	}
	public getAuthString (): string {
		return this.auth.toString();
	}


	public static FromJSON ( input: IServiceClient ): ServiceClient {
		return new ServiceClient()
			.setId( input.id )
			.setId( input.appId )
			.setOrgId( input.orgId )
			.setURI( URI.deserialize( input.uri.toString() ) )
			.setAuth( Auth.deserialize( input.auth.toString() ) )
		;
	}

	public generateCredentials (): any {
		return {
			credentials: {
				id: this.getId(),
				xsappname: this.getAuth().getOAuth2().getXSApp(),
				uaadomain: this.getAuth().getOAuth2().getUAADomain(),
				tenant: this.getAuth().getOAuth2().getIdentityZone(),
				uri_base: this.getURI().getBase(),
				auth_basic_username: this.getAuth().getBasic().getUsername(),
				auth_basic_password: this.getAuth().getBasic().getPassword(),
				auth_oauth2_token_uri: this.getAuth().getOAuth2().getTokenURI(),
				auth_oauth2_client_id: this.getAuth().getOAuth2().getClientId(),
				auth_oauth2_client_secret: this.getAuth().getOAuth2().getClientSecret(),
				auth_oauth2_grant_type: this.getAuth().getOAuth2().getGrantType()
				//auth_oauth2_scopes: this.getAuth().getOAuth2().getScopes().join( " " ),
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

	public static deserialize ( input: string ): ServiceClient {
		return ServiceClient.FromJSON( <IServiceClient>JSON.parse( input ) );
	}
}