import { Router } from "express";

export type RouteType = string | RegExp;

export interface Route {
	basePath: RouteType;
	create (): Router;
}