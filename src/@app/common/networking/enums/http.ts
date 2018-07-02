export const enum Method {

	HEAD = "head",
	GET = "get",
	POST = "post",
	PUT = "put",
	PATCH = "patch",
	DELETE = "delete",
}

export const enum StatusCode {

	Okay = 200,
	Created = 201,
	Accepted = 201,
	NoContent = 204,

	BadRequest = 400,
	Unauthorized = 401,
	Unprivillaged = 403,
	NotFound = 404,
	MethodNotAllowed  = 405,
	Conflict = 409,

	ServerError = 500,
	GatewayError = 502,
	GatewayTimeout = 504,
}


export const enum RequestHeader {
	Accept = "Accept",
	Authorization = "Authorization",
	ContentType = "Content-Type",
}

export const enum HeaderValue {
	ContentJSON = "application/json",
	ContentFormEncoded = "application/x-www-form-urlencoded",
}