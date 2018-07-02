import { Observable } from "rxjs/Observable";

import { HTTP, Request, RequestMethod, Params, Header, RequestHeaders, RequestHeadersValues, Response, HTTPError } from "@sap/loyalty/common/networking";
import { ClientErrorFactory, ClientErrors } from "@sap/loyalty/api-directory/client/services";

import { IOAuth2Clone, IOAuth2CloneBinding } from "../interfaces";
import { OAuth2Token, OAuth2Clone, OAuth2Binding } from "../models";
import { OAuth2TokenProvider } from "../services";


export class OAuth2Provider {

	private delegate: IOAuth2CloneBinding;
	private tokenProvider: OAuth2TokenProvider;
	private httpClient: HTTP;

	private serviceInstanceId: string;
	private orgId: string;

	constructor ( delegate: IOAuth2CloneBinding, serviceInstanceId: string, orgId: string ) {

		this.delegate = delegate;
		this.tokenProvider = new OAuth2TokenProvider( delegate );
		this.httpClient = new HTTP();

		this.serviceInstanceId = serviceInstanceId;
		this.orgId = orgId;
	}

	private getCloneURI (): string {
		return [ this.delegate.url, "sap", "rest", "broker", "clones" ].join( "/" );
	}
	private getCloneInstanceURI (): string {
		return [ this.delegate.url, "sap", "rest", "broker", "clones", this.serviceInstanceId ].join( "/" );
	}
	private getBindingURI (): string {
		return [ this.delegate.url, "sap", "rest", "broker", "clones", this.serviceInstanceId, "binding" ].join( "/" );
	}

	public decorateScope = ( scope: string ): string => {
		return [ this.delegate.xsappname, scope ].join( "." );
	};
	public decorateScopes = ( scopes: string[] = [] ): string[] => {
		return scopes.map( scope => this.decorateScope( scope ) );
	};


	private getClone ( token: string ): Observable<Response> {
		return this.httpClient.doRequest(
			new Request()
				.setMethod( RequestMethod.Get )
				.setURL( this.getCloneInstanceURI() )
				.addHeader( new Header(
					RequestHeaders.Authorization,
					RequestHeadersValues.BearerAuth( token )
				))
			)
		;
	}

	private createClone ( token: string, scopes: string[] = [] ): Observable<Response> {
		return this.httpClient.doRequest(
			new Request()
				.setMethod( RequestMethod.Post )
				.setURL( this.getCloneURI() )
				.addParam( new Params(
					"serviceinstanceid", this.serviceInstanceId
				))
				.addParam( new Params(
					"orgid", this.orgId
				))
				.addHeader( new Header(
					RequestHeaders.Authorization,
					RequestHeadersValues.BearerAuth( token )
				))
				.setData( {
					"xsappname": this.serviceInstanceId,
					//"authorities": scopes.map(  scope => `$XSMASTERAPPNAME.${ scope }` )
				})
			)
		;
	}

	private deleteClone ( cloneId: string, token: string ): Observable<Response> {
		return this.httpClient.doRequest(
			new Request()
				.setMethod( RequestMethod.Delete )
				.setURL( [ this.getCloneURI(), cloneId ].join( "/" ) )
				.addHeader( new Header(
					RequestHeaders.Authorization,
					RequestHeadersValues.BearerAuth( token )
				))
			)
		;
	}


	private getServiceBinding ( token: string ): Observable<Response> {
		return this.httpClient.doRequest(
			new Request()
				.setMethod( RequestMethod.Get )
				.setURL( this.getBindingURI() )
				.addHeader( new Header(
					RequestHeaders.Authorization,
					RequestHeadersValues.BearerAuth( token )
				))
			)
		;
	}

	public get (): Observable<OAuth2Clone> {
		return this.tokenProvider.generate()
			.flatMap( ( token: OAuth2Token ) => {
				return this.getClone( token.getToken() );
			})
			.map( ( response: Response ) => {
				return response.data();
			})
			.map( ( data: string ) => {
				return JSON.parse( data );
			})
			.map( ( data: IOAuth2Clone ) => {
				return OAuth2Clone.FromJSONBinding( data );
			})
		;
	}

	public generate ( scopes: string[] = [] ): Observable<OAuth2Binding> {
		let oauth2Token: string = "";
		return this.tokenProvider.generate()
			.flatMap( ( token: OAuth2Token ) => {
				oauth2Token = token.getToken();
				return this.createClone( oauth2Token, scopes );
			})
			.catch( ( error: HTTPError ) => {
				if ( JSON.stringify( error.message ).indexOf( "already exists" ) > -1 ) {
					return Observable.throw( ClientErrorFactory.Get( ClientErrors.Conflict ) );
				} else {
					return Observable.throw( error );
				}
			})
			.flatMap( () => {
				return this.getServiceBinding( oauth2Token );
			})
			.map( ( response: Response ) => {
				return response.data();
			})
			.map( ( data: string ) => {
				return JSON.parse( data );
			})
			.map( ( data: IOAuth2CloneBinding ) => {
				return OAuth2Binding.FromJSONBinding( data );
			})
		;
	}

	public remove ( cloneId: string ): Observable<boolean> {
		return this.tokenProvider.generate()
			.flatMap( ( token: OAuth2Token ) => {
				return this.deleteClone( cloneId, token.getToken() );
			})
			.map( () => {
				return true;
			})
		;
	}
}