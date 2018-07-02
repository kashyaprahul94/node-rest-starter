import { Response as ExpressResponse } from "express";
import { Response as NetworkResponse } from "../models/response";

export interface HybridResponse {
	express: ExpressResponse
	network: NetworkResponse,
}