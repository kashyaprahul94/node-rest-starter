import { IOAuth2Token } from "../interfaces/oauth2-token";

export class OAuth2Token {

	protected token: string;
	protected scopes: string[];
	protected validUntil: Date;

	public constructor ( token: string = "", scopes: string[] = [], validUntil: Date = new Date() ) {
		this.token = token;
		this.scopes = scopes;
		this.validUntil = validUntil;
	}

	public getToken (): string {
		return this.token;
	}
	public setToken ( token: string ): OAuth2Token {
		this.token = token;
		return this;
	}

	public getScopes (): string[] {
		return this.scopes;
	}
	public setScopes ( scopes: string[] ): OAuth2Token {
		this.scopes = scopes;
		return this;
	}

	public getValidUntil (): Date {
		return this.validUntil;
	}
	public setValidUntil ( validUntil: Date ): OAuth2Token {
		this.validUntil = validUntil;
		return this;
	}

	public static ParseJSONScopes ( scopes: string ): string[] {
		return scopes.split( " " );
	}

	public static GetValidUntil ( validity: number ): Date {
		return new Date();
	}

	public static FromJSON ( input: IOAuth2Token ): OAuth2Token {
		return new OAuth2Token(
			input.access_token,
			OAuth2Token.ParseJSONScopes( input.scope ),
			OAuth2Token.GetValidUntil( input.expires_in )
		)
	}
}