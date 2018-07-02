import * as HTTPClient from "request";
import { Observable, Subscriber } from "rxjs";

import { RequestMethod, StatusCode } from "../enums";
import { Request, Response, HTTPError } from "../models";


export class HTTP {

    private delegate: any;

    public constructor () {
        this.delegate = HTTPClient;
    }


	private static requestCallback ( observer: Subscriber<Response>, request: Request, error: any, response: HTTPClient.RequestResponse, body: any ) {
		const statusCode: number = ( response && response.statusCode ) || StatusCode.ServerError;
		if ( error || ! ( /^(1|2|3)[0-9][0-9]/.test( statusCode.toString() ) ) ) {
			let description: string = body;
			try {
				description = JSON.stringify( response.body );
			} catch {
				description = response.body || body;
			}
			observer.error(
				new HTTPError()
					.setName( error )
					.setCode( response.statusMessage || "HTTP_ERROR" )
					.setStatusCode( statusCode )
					.setDescription( description )
			);
		} else {
			observer.next(
				new Response()
					.setRequest( request )
					.setStatus( response.statusCode )
					.setIncomingHeaders( response.headers )
					.setData( body )
					.setHasBody( !!( body ) )
			);
			observer.complete();
		}
	}

	public doRequest ( request: Request ): Observable<Response> {
		const method: RequestMethod = request.getMethod();
		if ( method === RequestMethod.Get ) {
			return this.get( request );
		} else if ( method === RequestMethod.Post ) {
			return this.post( request );
		} else if ( method === RequestMethod.Put ) {
			return this.put( request );
		} else if ( method === RequestMethod.Patch ) {
			return this.patch( request );
		} else if ( method === RequestMethod.Delete ) {
			return this.delete( request );
		} else {
			return this.get( request );
		}
	}

    private get ( request: Request ): Observable<Response> {
		return Observable.create( ( observer: Subscriber<Response | HTTPError> ) => {
			this.delegate.get( request.build(), ( error: any, response: HTTPClient.RequestResponse, body: any ) => {
				HTTP.requestCallback( observer, request, error, response, body );
			})
		});
	}

	private post ( request: Request ): Observable<Response> {
		return Observable.create( ( observer: Subscriber<Response | HTTPError> ) => {
			this.delegate.post( request.build(), ( error: any, response: HTTPClient.RequestResponse, body: any ) => {
				HTTP.requestCallback( observer, request, error, response, body );
			})
		});
	}

	private put ( request: Request ): Observable<Response> {
		return Observable.create( ( observer: Subscriber<Response | HTTPError> ) => {
			this.delegate.put( request.build(), ( error: any, response: HTTPClient.RequestResponse, body: any ) => {
				HTTP.requestCallback( observer, request, error, response, body );
			})
		});
	}

	private patch ( request: Request ): Observable<Response> {
		return Observable.create( ( observer: Subscriber<Response | HTTPError> ) => {
			this.delegate.patch( request.build(), ( error: any, response: HTTPClient.RequestResponse, body: any ) => {
				HTTP.requestCallback( observer, request, error, response, body );
			})
		});
	}

	private delete ( request: Request ): Observable<Response> {
		return Observable.create( ( observer: Subscriber<Response | HTTPError> ) => {
			this.delegate.delete( request.build(), ( error: any, response: HTTPClient.RequestResponse, body: any ) => {
				HTTP.requestCallback( observer, request, error, response, body );
			})
		});
	}

}