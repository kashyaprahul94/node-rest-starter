import { BasicAuth, OAuth2Binding } from "@sap/loyalty/api-directory/auth";

import { IAuth, TypeAuthRule } from "../interfaces";

export class Auth {

	protected basic: BasicAuth;
	protected oauth2: OAuth2Binding;
	protected rules: TypeAuthRule;

	constructor () {
		this.basic = new BasicAuth();
		this.oauth2 = new OAuth2Binding();
		this.rules = {};
	}

	public getBasic (): BasicAuth {
		return this.basic;
	}
	public setBasic ( basicAuth: BasicAuth ): Auth {
		this.basic = basicAuth;
		return this;
	}

	public getOAuth2 (): OAuth2Binding {
		return this.oauth2;
	}
	public setOAuth2 ( oauth2: OAuth2Binding ): Auth {
		this.oauth2 = oauth2;
		return this;
	}

	public getRules (): TypeAuthRule {
		return this.rules;
	}
	public setRules ( rules: TypeAuthRule ): Auth {
		this.rules = rules;
		return this;
	}



	public static FromJSON ( input: IAuth ): Auth {
		return new Auth()
			.setBasic( BasicAuth.deserialize( input.basic.toString() ) )
			.setOAuth2( OAuth2Binding.deserialize( input.oauth2.toString() ) )
			.setRules( JSON.parse( input.rules.toString() || "{}" ) )
		;
	}

	public serialize (): string {
		return JSON.stringify({
			basic: this.basic.serialize(),
			oauth2: this.oauth2.serialize(),
			rules: JSON.stringify( this.rules )
		});
	}

	public static deserialize ( input: string ): Auth {
		return Auth.FromJSON( <IAuth>JSON.parse( input ) );
	}
}