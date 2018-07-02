import { IRoute } from "express";

import { APIRouter } from "./router";

export type RouteType = string | RegExp;

export interface APIRoute {
	path: RouteType;
	middleware (): APIRouter;
}

export interface APIEndpoint extends IRoute {

}