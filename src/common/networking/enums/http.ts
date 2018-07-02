import { encode } from "base-64";

	export const enum StatusCode {

		Okay = 200,
		Created = 201,
		NoContent = 204,
		BadRequest = 400,
		Unauthorized = 401,
		Unprivillaged = 403,
		NotFound = 404,
		MethodNotAllowed  = 405,
		Conflict = 409,
		ServerError = 500,
		GatewayError = 502
	}

	export const enum RequestMethod {

		Get = 0,
		Post = 1,
		Put = 2,

		Delete = 3,
		Options = 4,
		Head = 5,
		Patch = 6,

		Default = RequestMethod.Get
	}

	export const enum RequestMethodLabels {

		Get = "get",
		Post = "post",
		Put = "put",

		Delete = "delete",
		Options = "options",
		Head = "head",
		Patch = "patch"
	}

	export const RequestHeaders = {
		"Accept": "Accept",
		"Authorization": "Authorization",
		"ContentType": "Content-Type",
		"Tenant": "tenant",
		"Scopes": "scopes",
		"Token": "token",
		"TokenExpiry": "token-expiry",
		"Client": "client",
		"User": "user",
	};

	export const RequestHeadersValues: any = {

		"ContentJSON": "application/json",
		"ContentFormEncoded": "application/x-www-form-urlencoded",
		"AuthorizationBasic": "Basic",
		"AuthorizationBearer": "Bearer",

		BasicAuth: ( username: string, password: string ) => {
			return `${ RequestHeadersValues.AuthorizationBasic } ${ encode( [ username, password ].join( ":" ) ) }`;
		},
		BearerAuth: ( token: string ) => {
			return `${ RequestHeadersValues.AuthorizationBearer } ${ token }`;
		}
	};