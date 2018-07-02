import { Observable } from "rxjs/Observable";

import { HTTP, Request, RequestMethod, Params, Header, RequestHeaders, RequestHeadersValues, Response } from "@sap/loyalty/common/networking";

import { IOAuth2Token, IOAuth2CloneBinding } from "../interfaces";
import { OAuth2Token, OAuth2Binding } from "../models";


export class OAuth2TokenProvider {

	private delegate: IOAuth2CloneBinding;
	private httpClient: HTTP;

	constructor ( delegate: IOAuth2CloneBinding ) {
		this.delegate = delegate;
		this.httpClient = new HTTP();
	}

	private getTokenURI (): string {
		return [ this.delegate.url, "oauth", "token" ].join( "/" );
	}

	private getToken (): Observable<Response> {
		return this.httpClient.doRequest(
			new Request()
				.setMethod( RequestMethod.Get )
				.setURL( this.getTokenURI() )
				.addParam( new Params(
					OAuth2Binding.GrantTypeHeader, OAuth2Binding.DefualtGrantType
				))
				.addHeader( new Header(
					RequestHeaders.Authorization,
					RequestHeadersValues.BasicAuth( this.delegate.clientid, this.delegate.clientsecret )
				))
		);
	}


	public generate (): Observable<OAuth2Token> {
		return this.getToken()
			.map( ( response: Response ) => {
				return response.data();
			})
			.map( ( data: string ) => {
				return JSON.parse( data );
			})
			.map( ( tokenData: IOAuth2Token ) => {
				return OAuth2Token.FromJSON( tokenData )
			})
		;
	}
}