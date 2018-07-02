import { HTTPError, StatusCode } from "@sap/loyalty/common/networking";

export const enum Errors {

	Unauthorized,
	Unprivileged,
	Unknown
}

export class ErrorFactory {

	public constructor () {

	}

	public static Handle ( cause: Errors, ...extraInfo: any[] ): HTTPError {
		if ( cause === Errors.Unauthorized ) {
			return ErrorFactory.Unauthorized();
		} else if ( cause === Errors.Unprivileged ) {
			return ErrorFactory.Unprivileged( ...extraInfo );
		} else {
			return ErrorFactory.Unknown();
		}
	}

	private static Unauthorized (): HTTPError {
		return new HTTPError()
			.setStatusCode( StatusCode.Unauthorized )
			.setName( "Invalid Token" )
			.setCode( "UNAUTHORIZED" )
			.setDescription( "Bearer Token is missing or invalid." )
		;
	}

	private static Unprivileged ( missingScope?: string ): HTTPError {
		return new HTTPError()
			.setStatusCode( StatusCode.Unprivillaged )
			.setName( "Insufficient Privillages" )
			.setCode( "FORBIDDEN" )
			.setDescription( "Necessary scope(s) were missing" + ( missingScope ? ` ( ${ missingScope } )` : "" ) )
		;
	}

	private static Unknown (): HTTPError {
		return new HTTPError()
			.setStatusCode( StatusCode.ServerError )
			.setName( "Something went wrong" )
			.setCode( "INTERNAL_SERVER_ERROR" )
			.setDescription( "Request cannot be processed." )
		;
	}

}