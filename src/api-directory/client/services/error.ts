import { HTTPError, StatusCode } from "@sap/loyalty/common/networking";

export const enum ClientErrors {

	NotFound,
	Conflict,
	NoServiceInstanceId,
	NoOrgId,
	Unknown
}

export class ClientErrorFactory {

	public constructor () {

	}

	public static Get ( cause: ClientErrors ): HTTPError {

		if ( cause === ClientErrors.NotFound ) {
			return ClientErrorFactory.ClientNotFound();
		} else if ( cause === ClientErrors.Conflict ) {
			return ClientErrorFactory.ClientConflict();
		} else if ( cause === ClientErrors.NoServiceInstanceId ) {
			return ClientErrorFactory.NoServiceInstanceIdProvided();
		} else if ( cause === ClientErrors.NoOrgId ) {
			return ClientErrorFactory.NoOrgId();
		} else {
			return ClientErrorFactory.Unknown();
		}
	}

	private static ClientNotFound (): HTTPError {
		return new HTTPError()
			.setStatusCode( StatusCode.NotFound )
			.setName( "NOT_FOUND" )
			.setCode( "API_DIRECTORY_CLIENT_NOT_FOUND" )
			.setDescription( "No such client exists. Probably invalid URL" )
		;
	}

	private static ClientConflict (): HTTPError {
		return new HTTPError()
			.setStatusCode( StatusCode.Conflict )
			.setName( "Conflict" )
			.setCode( "CONFLICT" )
			.setDescription( "Client seems to be already existing." )
		;
	}

	private static NoServiceInstanceIdProvided (): HTTPError {
		return new HTTPError()
			.setStatusCode( StatusCode.BadRequest )
			.setName( "Service Instance Id is missing" )
			.setCode( "MISSING_SERVICE_INSTANCE_ID" )
			.setDescription( "Could not find 'serviceInstanceId' in Request Body." )
		;
	}

	private static NoOrgId (): HTTPError {
		return new HTTPError()
			.setStatusCode( StatusCode.BadRequest )
			.setName( "Organization Id is missing" )
			.setCode( "MISSING_ORG_ID" )
			.setDescription( "Could not find 'orgId' in Request Body." )
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