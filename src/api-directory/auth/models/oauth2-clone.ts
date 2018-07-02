import { IOAuth2Clone } from "../interfaces/oauth2-clone";

export class OAuth2Clone {

	protected appId: string;
	protected xsappName: string;
	protected instanceId: string;
	protected clientId: string;

	public constructor ( appId: string = "", xsappName: string = "", instanceId: string = "", clientId: string = "" ) {
		this.appId = appId;
		this.xsappName = xsappName;
		this.instanceId = instanceId;
		this.clientId = clientId;
	}

	public getAppId (): string {
		return this.appId;
	}
	public setAppId ( appId: string ): OAuth2Clone {
		this.appId = appId;
		return this;
	}

	public getXsappName (): string {
		return this.xsappName;
	}
	public setXsappName ( xsappName: string ): OAuth2Clone {
		this.xsappName = xsappName;
		return this;
	}

	public getInstanceId (): string {
		return this.instanceId;
	}
	public setInstanceId ( instanceId: string ): OAuth2Clone {
		this.instanceId = instanceId;
		return this;
	}

	public getClientId (): string {
		return this.clientId;
	}
	public setClientId ( clientId: string ): OAuth2Clone {
		this.clientId = clientId;
		return this;
	}


	public static FromJSONBinding ( input: IOAuth2Clone ): OAuth2Clone {
		return new OAuth2Clone(
			input.appid,
			input.xsappname,
			input.serviceinstanceid,
			input.clientid
		);
	}

	public static FromJSON ( input: IOAuth2Clone ): OAuth2Clone {
		return new OAuth2Clone()
			.setAppId( input.appid )
			.setXsappName( input.xsappname )
			.setInstanceId( input.serviceinstanceid )
			.setClientId( input.clientid )
		;
	}

	public serialize (): string {
		return JSON.stringify({
			appId: this.appId,
			xsappName: this.xsappName,
			instanceId: this.instanceId,
			clientId: this.clientId
		});
	}

	public static deserialize ( input: string ): OAuth2Clone {
		return OAuth2Clone.FromJSON( <IOAuth2Clone>JSON.parse( input ) );
	}
}