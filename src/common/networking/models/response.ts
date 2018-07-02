import { IncomingHttpHeaders } from "http";
import { Response as ExpressResponse } from "express";

import { Request, HybridResponse, IHeader, Header, HeaderValueType } from "../index";
import { Observable } from "rxjs/Observable";

export class Response {

    private _request: Request;
    private _status: number;
    private _data: any;
    private _headers: IHeader;
    private _hasBody: boolean;

    constructor ( request: Request = null, status: number = -1, headers: IHeader = null, data: any = null, hasBody: boolean = true ) {
		this._request = request;
        this._status = status;
        this._headers = headers;
        this._data = data;
        this._hasBody = hasBody;
    }


	public request (): Request {
		return this._request;
	}
	public setRequest ( request: Request ): Response {
		this._request = request;
		return this;
	}

    public status (): number {
        return this._status
    }
    public setStatus ( status: number ): Response {
        this._status = status;
        return this;
    }

	public headers ( name?: string ): HeaderValueType | IHeader {
		if ( name ) {
			return this._headers[ name ];
		}
		return this._headers;
	}
	public getHeaders (): IHeader {
		return this._headers;
	}
    public setHeaders ( headers: IHeader ): Response {
        this._headers = headers;
        return this;
    }
	public setIncomingHeaders ( headers: IncomingHttpHeaders ): Response {
		this._headers = headers;
		return this;
	}

    public data (): any {
        return this._data;
    }
    public setData ( data: any ): Response {
        this._data = data;
        return this;
    }

    public hasBody (): any {
        return this._hasBody;
    }
    public setHasBody ( hasBody: boolean ): Response {
        this._hasBody = hasBody;
        return this;
    }





    private static CORSOrigin ( expressResponse: ExpressResponse, incomingHeaders: IHeader ): Observable<ExpressResponse> {
		return Observable.of( expressResponse )
			.map( () => {
				expressResponse.setHeader( "Access-Control-Allow-Origin", "*" );
				return expressResponse;
			})
		;
	}

    private static CORSMethods ( expressResponse: ExpressResponse, incomingHeaders: IHeader ): Observable<ExpressResponse> {
		return Observable.of( expressResponse )
			.map( () => {
				expressResponse.setHeader( "Access-Control-Allow-Methods", [ "GET", "POST", "PUT", "DELETE", "PATCH", "INDEX", "OPTIONS" ].join( Header.Delimiter ) );
				return expressResponse;
			})
		;
	}

    private static CORSExposeHeaders ( expressResponse: ExpressResponse, incomingHeaders: IHeader ): Observable<ExpressResponse> {
		return Observable.pairs( incomingHeaders )
			.map( ( header: string[] ) => {
				return new Header( header[ 0 ], header[ 1 ] );
			})
			.reduce( ( acc: string[], item: Header, index: number ) => {
				return acc.concat( item.getName() );
			}, [] )
			.map( ( headers: string[] ) => {
				expressResponse.setHeader( "Access-Control-Expose-Headers", headers.join( Header.Delimiter ) );
				return expressResponse;
			})
		;
	}

    private static SetCORSHeaders ( expressResponse: ExpressResponse, incomingHeaders: IHeader ): Observable<ExpressResponse> {
		return Observable.of( expressResponse )
			.flatMap( ( response: ExpressResponse ) => {
				return Response.CORSOrigin( response, incomingHeaders );
			})
			.flatMap( ( response: ExpressResponse ) => {
				return Response.CORSMethods( response, incomingHeaders );
			})
			.flatMap( ( response: ExpressResponse ) => {
				return Response.CORSExposeHeaders( response, incomingHeaders );
			})
			.map( ( response: ExpressResponse ) => {
				return response;
			})
		;
	}

	public static SetOutgoingHeaders ( expressResponse: ExpressResponse, networkResponse: Response ): Observable<HybridResponse> {
		return Observable.pairs( <IHeader>networkResponse.getHeaders() )
			.map( ( header: string[] ) => {
				return new Header( header[ 0 ], header[ 1 ] );
			})
			.map( ( header: Header ) => {
				expressResponse.setHeader( header.getName(), <string>header.getValue() );
				return header;
			})
			.reduce( ( acc: Header[], item: Header, index: number ) => {
				return acc.concat( item );
			}, [] )
			.flatMap( () => {
				return Response.SetCORSHeaders( expressResponse, <IHeader>networkResponse.getHeaders() );
			})
			.map( ( response: ExpressResponse ) => {
				expressResponse = response;
				return expressResponse;
			})
			.map( () => {
				return <HybridResponse>{
					express: expressResponse,
					network: networkResponse
				};
			})
		;
	}
}