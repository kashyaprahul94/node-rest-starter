import { IOAuth2CloneBinding, IOAuth2Binding } from "../interfaces/oauth2-binding";

export class OAuth2Binding {

	public static GrantTypeHeader: string = "grant_type";
	public static DefualtGrantType: string = "client_credentials";

	protected tokenURI: string;
	protected clientId: string;
	protected clientSecret: string;
	protected scopes: string[];
	protected grantType: string;
	protected identityZone: string;
	protected xsApp: string;
	protected uaaDomain: string;

	public constructor ( tokenURI: string = "", clientId: string = "", clientSecret: string = "", scopes: string[] = [], identityZone: string = "", xsApp: string = "", uaaDomain: string = "" ) {
		this.tokenURI = tokenURI;
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.scopes = scopes;
		this.grantType = OAuth2Binding.DefualtGrantType;
		this.identityZone = identityZone;
		this.xsApp = xsApp;
		this.uaaDomain = uaaDomain;
	}

	public getTokenURI (): string {
		return this.tokenURI;
	}
	public setTokenURI ( tokenURI: string ): OAuth2Binding {
		this.tokenURI = tokenURI;
		return this;
	}

	public getClientId (): string {
		return this.clientId;
	}
	public setClientId ( clientId: string ): OAuth2Binding {
		this.clientId = clientId;
		return this;
	}

	public getClientSecret (): string {
		return this.clientSecret;
	}
	public setClientSecret ( clientSecret: string ): OAuth2Binding {
		this.clientSecret = clientSecret;
		return this;
	}

	public getScopes (): string[] {
		return this.scopes;
	}
	public setScopes ( scopes: string[] ): OAuth2Binding {
		this.scopes = scopes;
		return this;
	}

	public getGrantType (): string {
		return this.grantType;
	}
	public setGrantType ( grantType: string ): OAuth2Binding {
		this.grantType = grantType;
		return this;
	}

	public getIdentityZone (): string {
		return this.identityZone;
	}
	public setIdentityZone ( identityZone: string ): OAuth2Binding {
		this.identityZone = identityZone;
		return this;
	}

	public getXSApp (): string {
		return this.xsApp;
	}
	public setXSApp ( xsApp: string ): OAuth2Binding {
		this.xsApp = xsApp;
		return this;
	}

	public getUAADomain (): string {
		return this.uaaDomain;
	}
	public setUAADomain ( uaaDomain: string ): OAuth2Binding {
		this.uaaDomain = uaaDomain;
		return this;
	}

	public static FromJSONBinding ( input: IOAuth2CloneBinding ): OAuth2Binding {
		return new OAuth2Binding(
			input.url,
			input.clientid,
			input.clientsecret,
			[],
			input.identityzone,
			input.xsappname,
			input.uaadomain,
		);
	}

	public static FromJSON ( input: IOAuth2Binding ): OAuth2Binding {
		return new OAuth2Binding()
			.setTokenURI( input.tokenURI )
			.setClientId( input.clientId )
			.setClientSecret( input.clientSecret )
			.setScopes( input.scopes )
			.setGrantType( input.grantType )
			.setIdentityZone( input.identityZone )
			.setXSApp( input.xsApp )
			.setUAADomain( input.uaaDomain )
		;
	}

	public serialize (): string {
		return JSON.stringify({
			tokenURI: this.tokenURI,
			clientId: this.clientId,
			clientSecret: this.clientSecret,
			scopes: this.scopes,
			grantType: this.grantType,
			identityZone: this.identityZone,
			xsApp: this.xsApp,
			uaaDomain: this.uaaDomain
		});
	}

	public static deserialize ( input: string ): OAuth2Binding {
		return OAuth2Binding.FromJSON( <IOAuth2Binding>JSON.parse( input ) );
	}
}