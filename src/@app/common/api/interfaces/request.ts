import { Request } from "express";

export interface IBaseAPIRequest {
	body: any;
	params: any;
}

export interface APIRequest<T extends IBaseAPIRequest> extends Request {
	body: T[ "body" ];
	params: T[ "params" ];
}